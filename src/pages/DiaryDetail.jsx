import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { getWeatherEmoji } from '../constants/weather';
import './DiaryDetail.css';

export default function DiaryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, remove, toggleFavorite, userId } = useDiary();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [titleExpanded, setTitleExpanded] = useState(false);
  const entry = getById(userId, id);

  if (!entry) {
    return (
      <>
        <TopBar title="일기 상세" showBack />
        <main className="diary-detail-page page-grid-bg page-transition">
          <p className="diary-detail-missing">일기를 찾을 수 없어요.</p>
        </main>
        <BottomNav />
      </>
    );
  }

  const [y, m, d] = entry.date.split('-');
  const dateLabel = `${y}년 ${Number(m)}월 ${Number(d)}일`;
  const titleShort = `${Number(m)}/${Number(d)} 일기`;

  const handleShare = async () => {
    const text = `${dateLabel} 그림일기\n${entry.text || ''}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${dateLabel} 그림일기`,
          text,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') copyAndAlert();
      }
    } else {
      copyAndAlert();
    }
  };

  function copyAndAlert() {
    const text = `${dateLabel} 그림일기\n${entry.text || ''}\n${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => alert('링크가 복사되었어요.'));
  }

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    remove(entry.id);
    navigate('/', { replace: true });
  };

  const handleEdit = () => {
    navigate(`/diary/write/${entry.date}`);
  };

  const rightButtons = (
    <div className="diary-detail-topbar-actions">
      <button type="button" className="topbar-icon-btn" onClick={() => toggleFavorite(entry.id)} aria-label={entry.favorite ? '즐겨찾기 해제' : '즐겨찾기'}>
        {entry.favorite ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#DD9CA7"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DD9CA7" strokeWidth="2" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        )}
      </button>
      <button type="button" className="topbar-icon-btn" onClick={handleShare} aria-label="공유">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DD9CA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.82 3.98M15.41 6.51l-6.82 3.98"/></svg>
      </button>
    </div>
  );

  return (
    <>
      <TopBar title={titleShort} showBack rightButton={rightButtons} titleAlign="left" />
      <main className="diary-detail-page page-grid-bg page-transition">
        <div className="diary-detail-paper">
          <p className="diary-detail-date">{dateLabel}</p>
          {(entry.title != null && entry.title !== '') && (
            <div className="diary-detail-title-block">
              <span className="diary-detail-title-label">제목: </span>
              <span
                className={`diary-detail-title-text ${titleExpanded ? 'expanded' : ''}`}
                title={entry.title}
                onClick={() => setTitleExpanded((v) => !v)}
                onKeyDown={(e) => e.key === 'Enter' && setTitleExpanded((v) => !v)}
                role="button"
                tabIndex={0}
                aria-label={titleExpanded ? '제목 접기' : '제목 전체 보기'}
              >
                {entry.title}
              </span>
            </div>
          )}
          {entry.drawingData && (
            <div className="diary-detail-drawing">
              <img src={entry.drawingData} alt="오늘의 그림" />
            </div>
          )}
          {entry.weather && (
            <div className="diary-detail-weather-wrap">
              <span className="diary-detail-weather-icon" aria-label="마음의 날씨">
                {getWeatherEmoji(entry.weather)}
              </span>
            </div>
          )}
          {entry.text && (
            <div className="diary-detail-text-wrap">
              <div className="diary-detail-text">{entry.text}</div>
            </div>
          )}
          <div className="diary-detail-actions">
            <button type="button" className="diary-detail-btn edit" onClick={handleEdit}>
              <span>수정하기</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button
              type="button"
              className="diary-detail-btn delete"
              onClick={handleDelete}
            >
              <span>{confirmDelete ? '정말 삭제할까요?' : '삭제하기'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
