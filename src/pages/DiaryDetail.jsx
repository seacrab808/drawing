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
  const entry = getById(userId, id);

  if (!entry) {
    return (
      <>
        <TopBar title="일기 상세" showBack />
        <main className="diary-detail-page page-grid-bg">
          <p className="diary-detail-missing">일기를 찾을 수 없어요.</p>
        </main>
        <BottomNav />
      </>
    );
  }

  const [y, m, d] = entry.date.split('-');
  const dateLabel = `${y}년 ${Number(m)}월 ${Number(d)}일`;

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

  const shareButton = (
    <button type="button" className="topbar-share-btn" onClick={handleShare}>
      공유하기
    </button>
  );

  return (
    <>
      <TopBar title="일기 상세" showBack rightButton={shareButton} />
      <main className="diary-detail-page page-grid-bg">
        <div className="diary-detail-paper">
          <p className="diary-detail-date">{dateLabel}</p>
          {entry.drawingData && (
            <div className="diary-detail-drawing">
              <img src={entry.drawingData} alt="오늘의 그림" />
            </div>
          )}
          {entry.weather && (
            <p className="diary-detail-weather">
              마음의 날씨 {getWeatherEmoji(entry.weather)}
            </p>
          )}
          {entry.text && (
            <div className="diary-detail-text">{entry.text}</div>
          )}
          <div className="diary-detail-actions">
            <button type="button" className="diary-detail-btn favorite" onClick={() => toggleFavorite(entry.id)}>
              {entry.favorite ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기'}
            </button>
            <button type="button" className="diary-detail-btn edit" onClick={handleEdit}>
              수정하기
            </button>
            <button
              type="button"
              className="diary-detail-btn delete"
              onClick={handleDelete}
            >
              {confirmDelete ? '정말 삭제할까요? (다시 누르면 삭제)' : '삭제하기'}
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
