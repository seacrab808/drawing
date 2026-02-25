import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { WEATHER_OPTIONS } from '../constants/weather';
import './DiaryWrite.css';

export default function DiaryWrite() {
  const { dateStr } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { getByDate, save, userId } = useDiary();
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('');
  const [text, setText] = useState('');
  const [drawingData, setDrawingData] = useState(null);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const entry = getByDate(userId, dateStr);
    if (entry) {
      setDate(entry.date);
      setWeather(entry.weather || '');
      setText(entry.text || '');
      setDrawingData(entry.drawingData || null);
      setSavedId(entry.id);
    } else if (dateStr) {
      setDate(dateStr);
    }
  }, [dateStr, currentUser, userId, getByDate]);

  useEffect(() => {
    const state = location.state;
    if (state?.drawingData) setDrawingData(state.drawingData);
    if (state?.weather !== undefined) setWeather(state.weather);
    if (state?.text !== undefined) setText(state.text);
    if (state?.savedId) setSavedId(state.savedId);
  }, [location.state]);

  const handleSave = () => {
    if (!userId || !date) return;
    const entry = {
      id: savedId,
      userId,
      date,
      weather,
      text: text.trim(),
      drawingData,
      updatedAt: Date.now(),
    };
    const result = save(entry);
    if (result) {
      setSavedId(result.id);
      navigate(`/diary/detail/${result.id}`, { replace: true });
    }
  };

  const goDraw = () => {
    const state = { dateStr: date || dateStr, weather, text, drawingData, savedId };
    navigate(`/diary/draw/${dateStr || date}`, { state });
  };

  const displayDate = date || dateStr || '';
  const [y, m, d] = displayDate.split('-');
  const dateLabel = y && m && d ? `${y}년 ${Number(m)}월 ${Number(d)}일` : '날짜';

  return (
    <>
      <TopBar title="그림일기 쓰기" showBack />
      <main className="diary-write-page page-grid-bg">
        <div className="diary-write-paper">
          <section className="diary-write-section">
            <h3 className="diary-write-label">날짜</h3>
            <p className="diary-write-date">{dateLabel}</p>
          </section>

          <section className="diary-write-section">
            <h3 className="diary-write-label">오늘의 그림</h3>
            <button type="button" className="diary-write-draw-btn" onClick={goDraw}>
              {drawingData ? '🖼️ 그린 그림 보기 / 수정하기' : '✏️ 그림 그리기'}
            </button>
            {drawingData && (
              <div className="diary-write-preview">
                <img src={drawingData} alt="오늘의 그림" />
              </div>
            )}
          </section>

          <section className="diary-write-section">
            <h3 className="diary-write-label">마음의 날씨</h3>
            <div className="diary-write-weather">
              {WEATHER_OPTIONS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`diary-write-weather-btn ${weather === w.id ? 'active' : ''}`}
                  onClick={() => setWeather(w.id)}
                  title={w.label}
                >
                  <span className="diary-write-weather-emoji">{w.emoji}</span>
                  <span className="diary-write-weather-label">{w.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="diary-write-section">
            <h3 className="diary-write-label">오늘의 기록</h3>
            <textarea
              className="diary-write-text"
              placeholder="오늘 하루는 어땠나요? 생각나는 대로 적어 보세요."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
            />
          </section>

          <button type="button" className="diary-write-save" onClick={handleSave}>
            저장하기
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
