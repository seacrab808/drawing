import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import './More.css';

export default function More() {
  return (
    <>
      <TopBar title="더보기" />
      <main className="more-page page-grid-bg">
        <nav className="more-list">
          <Link to="/favorites" className="more-item">
            <span className="more-icon">⭐</span>
            <span className="more-label">즐겨찾기</span>
            <span className="more-arrow">›</span>
          </Link>
          <Link to="/profile" className="more-item">
            <span className="more-icon">👤</span>
            <span className="more-label">프로필</span>
            <span className="more-arrow">›</span>
          </Link>
          <Link to="/settings" className="more-item">
            <span className="more-icon">⚙️</span>
            <span className="more-label">설정</span>
            <span className="more-arrow">›</span>
          </Link>
        </nav>
      </main>
      <BottomNav />
    </>
  );
}
