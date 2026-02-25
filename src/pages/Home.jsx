import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDiary } from '../context/DiaryContext';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import './Home.css';

const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getList } = useDiary();
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [showPicker, setShowPicker] = useState(false);

  const diaries = getList();
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const daysInMonth = lastDay.getDate();

  const getEntry = (dateStr) => diaries.find((d) => d.date === dateStr) || null;

  const getDayOfWeek = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    return d.getDay();
  };

  const handleCellClick = (day) => {
    if (!day) return;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = getEntry(dateStr);
    if (entry) {
      navigate(`/diary/detail/${entry.id}`);
    } else {
      navigate(`/diary/write/${dateStr}`);
    }
  };

  const today = new Date();
  const isToday = (day) =>
    viewYear === today.getFullYear() &&
    viewMonth === today.getMonth() &&
    day === today.getDate();

  const years = Array.from({ length: 11 }, (_, i) => viewYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const userName = currentUser?.name || '회원';

  return (
    <>
      <TopBar title={`안녕하세요, ${userName}님`} titleAlign="left" />
      <main className="home-page page-grid-bg">
        <div className="home-paper">
          <button
            type="button"
            className="home-month-toggle"
            onClick={() => setShowPicker((s) => !s)}
            aria-expanded={showPicker}
          >
            <span className="home-month-label">{MONTH_NAMES[viewMonth]}</span>
            <span className="home-month-arrow">{showPicker ? '▲' : '▼'}</span>
          </button>

          {showPicker && (
            <div className="home-picker">
              <div className="home-picker-row">
                <label className="home-picker-label">
                  <span className="home-picker-label-text">년</span>
                  <select
                    value={viewYear}
                    onChange={(e) => setViewYear(Number(e.target.value))}
                    className="home-select"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}년</option>
                    ))}
                  </select>
                </label>
                <label className="home-picker-label">
                  <span className="home-picker-label-text">월</span>
                  <select
                    value={viewMonth}
                    onChange={(e) => setViewMonth(Number(e.target.value))}
                    className="home-select"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>{MONTH_NAMES[m]}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="button" className="home-picker-close" onClick={() => setShowPicker(false)}>
                선택 완료
              </button>
            </div>
          )}

          <div className="home-calendar">
            <div className="home-days">
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const entry = getEntry(dateStr);
                const hasDiary = !!entry;
                const drawingData = entry?.drawingData || null;
                const dow = getDayOfWeek(day);
                const weekdayLabel = WEEKDAYS[dow];
                const isSat = dow === 6;
                const isSun = dow === 0;
                const todayClass = isToday(day) ? 'today' : '';
                return (
                  <button
                    key={day}
                    type="button"
                    className={`home-day ${hasDiary ? 'has-diary' : ''} ${isSat ? 'sat' : ''} ${isSun ? 'sun' : ''} ${todayClass}`}
                    onClick={() => handleCellClick(day)}
                    style={drawingData ? { backgroundImage: `url(${drawingData})` } : undefined}
                  >
                    {drawingData && <span className="home-day-bg-cover" />}
                    <span className="home-day-num">{day}</span>
                    <span className="home-day-weekday">{weekdayLabel}</span>
                    {!hasDiary && <span className="home-day-write">그림일기 쓰기</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="home-info-bar">
            <span className="home-info-icon" aria-hidden>?</span>
            <span className="home-info-text">그림일기 어플 사용 방법</span>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
