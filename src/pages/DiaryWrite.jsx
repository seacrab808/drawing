import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { MOOD_OPTIONS } from '../constants/weather';
import './DiaryWrite.css';

export default function DiaryWrite() {
  const { dateStr } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { getByDate, save, userId } = useDiary();
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [weather, setWeather] = useState('');
  const [text, setText] = useState('');
  const [drawingData, setDrawingData] = useState(null);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const entry = getByDate(userId, dateStr);
    if (entry) {
      setDate(entry.date);
      setTitle(entry.title ?? '');
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
    if (state?.title !== undefined) setTitle(state.title);
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
      title: title.trim(),
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
    const state = { dateStr: date || dateStr, title, weather, text, drawingData, savedId };
    navigate(`/diary/draw/${dateStr || date}`, { state });
  };

  const displayDate = date || dateStr || '';
  const [y, m, d] = displayDate.split('-');
  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const weekdayLabel = y && m && d ? WEEKDAYS[new Date(Number(y), Number(m) - 1, Number(d)).getDay()] : '';
  const dateLabel = y && m && d ? `${y}년 ${Number(m)}월 ${Number(d)}일 ${weekdayLabel}요일` : '날짜';

  const maxTextLen = 100;
  const textCount = text.length;

  return (
    <>
      <TopBar title="그림 일기 작성하기" showBack />
      <main className="diary-write-page page-grid-bg page-transition">
        <div className="diary-write-paper">
          <section className="diary-write-date-card">
            <p className="diary-write-date">{dateLabel}</p>
            <p className="diary-write-prompt">오늘 하루는 어땠나요?</p>
          </section>

          <section className="diary-write-section diary-write-folder diary-write-folder-title">
            <h3 className="diary-write-label">제목</h3>
            <div className="diary-write-title-wrap">
              <input
                type="text"
                className="diary-write-title-input"
                placeholder="오늘 일기의 제목을 적어 주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={40}
              />
              <span className="diary-write-title-count">{title.length}/40</span>
            </div>
          </section>

          <section className="diary-write-section diary-write-folder">
            <h3 className="diary-write-label">오늘의 그림</h3>
            <div className="diary-write-draw-area">
              <div className="diary-write-draw-square">
                {drawingData ? (
                  <div className="diary-write-preview">
                    <img src={drawingData} alt="오늘의 그림" />
                  </div>
                ) : (
                  <div className="diary-write-draw-placeholder" aria-hidden />
                )}
                <button type="button" className="diary-write-draw-btn" onClick={goDraw}>
                  그림 그리기
                </button>
              </div>
            </div>
          </section>

          <section className="diary-write-section diary-write-folder">
            <h3 className="diary-write-label">마음의 날씨</h3>
            <div className="diary-write-mood-grid">
              {MOOD_OPTIONS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`diary-write-mood-btn ${weather === w.id ? 'active' : ''}`}
                  onClick={() => setWeather(w.id)}
                  title={w.label}
                >
                  <span className="diary-write-mood-emoji">{w.emoji}</span>
                  <span className="diary-write-mood-label">{w.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="diary-write-section diary-write-folder">
            <h3 className="diary-write-label">오늘의 기록</h3>
            <div className="diary-write-text-wrap">
              <textarea
                className="diary-write-text"
                placeholder="소중했던 오늘을 글로 담아 보세요..."
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, maxTextLen))}
                maxLength={maxTextLen}
                rows={5}
              />
              <span className="diary-write-text-count">{textCount}/{maxTextLen}</span>
            </div>
          </section>

          <button type="button" className="diary-write-save" onClick={handleSave}>
            일기 저장하기 ✓
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
