import { useNavigate } from 'react-router-dom';
import { useDiary } from '../context/DiaryContext';
import TopBar from '../components/TopBar';
import { getWeatherEmoji } from '../constants/weather';
import './Favorites.css';

export default function Favorites() {
  const navigate = useNavigate();
  const { getList } = useDiary();
  const favorites = getList().filter((d) => d.favorite);

  return (
    <>
      <TopBar title="즐겨찾기" showBack />
      <main className="favorites-page page-grid-bg page-transition">
        {favorites.length === 0 ? (
          <p className="favorites-empty">즐겨찾기한 일기가 없어요.</p>
        ) : (
          <ul className="favorites-list">
            {favorites.map((entry) => {
              const [y, m, d] = entry.date.split('-');
              const dateLabel = `${y}년 ${Number(m)}월 ${Number(d)}일`;
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    className="favorites-item"
                    onClick={() => navigate(`/diary/detail/${entry.id}`)}
                  >
                    <span className="favorites-date">{dateLabel}</span>
                    {entry.weather && (
                      <span className="favorites-weather">{getWeatherEmoji(entry.weather)}</span>
                    )}
                    {entry.drawingData && (
                      <span className="favorites-thumb">
                        <img src={entry.drawingData} alt="" />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
