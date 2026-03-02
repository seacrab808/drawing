import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useDiary } from '../context/DiaryContext';
import './Settings.css';

function getConsecutiveDays(list) {
  if (!list.length) return 0;
  const dates = [...new Set(list.map((d) => d.date))].sort().reverse();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  if (!dates.includes(todayStr)) return 0;
  let count = 0;
  const d = new Date(today);
  for (;;) {
    const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!dates.includes(s)) break;
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function getThisMonthCount(list) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return list.filter((d) => {
    const [dy, dm] = d.date.split('-');
    return dy === String(y) && dm === m;
  }).length;
}

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { getList } = useDiary();
  const list = getList();

  const stats = useMemo(() => ({
    total: list.length,
    streak: getConsecutiveDays(list),
    thisMonth: getThisMonthCount(list),
  }), [list]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const displayName = currentUser?.name ?? '사용자';
  const displayId = currentUser?.id ?? '';

  return (
    <>
      <TopBar title="⚙️ 설정" showBack />
      <main className="settings-page page-grid-bg">
        <div className="settings-wrap">
          {/* 프로필 카드 */}
          <section className="settings-card settings-profile-card">
            <div className="settings-avatar" aria-hidden />
            <div className="settings-profile-info">
              <p className="settings-profile-name">{displayName}</p>
              {displayId && <p className="settings-profile-email">{displayId}</p>}
              <p className="settings-profile-badge">그림일기 {stats.streak > 0 ? stats.streak : 0}일째 🎨</p>
            </div>
            <button type="button" className="settings-profile-more" aria-label="더보기">⋮</button>
          </section>

          {/* 나의 기록 */}
          <section className="settings-card settings-records-card">
            <h2 className="settings-card-title">나의 기록</h2>
            <div className="settings-stats">
              <div className="settings-stat">
                <span className="settings-stat-num">{stats.total}</span>
                <span className="settings-stat-label">총 일기</span>
              </div>
              <div className="settings-stat">
                <span className="settings-stat-num">{stats.streak} 🎉</span>
                <span className="settings-stat-label">연속 작성</span>
              </div>
              <div className="settings-stat">
                <span className="settings-stat-num">{stats.thisMonth}</span>
                <span className="settings-stat-label">이번달</span>
              </div>
            </div>
          </section>

          {/* 마음에 담은 일기 */}
          <Link to="/favorites" className="settings-card settings-link-card">
            <span className="settings-link-icon">❤️</span>
            <span className="settings-link-text">마음에 담은 일기</span>
            <span className="settings-link-arrow">›</span>
          </Link>

          {/* 기타 */}
          <section className="settings-card settings-etc-card">
            <h2 className="settings-card-title">기타</h2>
            <div className="settings-etc-list">
              <button type="button" className="settings-etc-item">
                <span className="settings-etc-icon">🎨</span>
                <span className="settings-etc-text">테마 색상</span>
                <span className="settings-link-arrow">›</span>
              </button>
              <button type="button" className="settings-etc-item">
                <span className="settings-etc-icon">?</span>
                <span className="settings-etc-text">도움말</span>
                <span className="settings-link-arrow">›</span>
              </button>
            </div>
          </section>

          <button type="button" className="settings-logout" onClick={handleLogout}>
            로그아웃
          </button>

          <p className="settings-version">draw a day v1.0.0</p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
