import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import './Profile.css';

export default function Profile() {
  const { currentUser, logout } = useAuth();

  return (
    <>
      <TopBar title="프로필" showBack />
      <main className="profile-page page-grid-bg">
        <div className="profile-paper">
          <div className="profile-avatar">👤</div>
          <h2 className="profile-name">{currentUser?.name || '이름'}</h2>
          <p className="profile-id">@{currentUser?.id || '아이디'}</p>
          <button type="button" className="profile-logout" onClick={logout}>
            로그아웃
          </button>
        </div>
      </main>
    </>
  );
}
