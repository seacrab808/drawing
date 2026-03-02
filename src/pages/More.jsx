import { useMemo, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useDiary } from '../context/DiaryContext';
import { PROFILE_CHARACTERS, DEFAULT_PROFILE_SRC } from '../constants/profileCharacters';
import './Settings.css';

function getConsecutiveDays(list) {
  if (!list.length) return 0;
  const datesSet = new Set(list.map((d) => d.date));
  const dates = [...datesSet].sort().reverse();
  const lastStr = dates[0];
  const [y, m, day] = lastStr.split('-').map(Number);
  let cur = new Date(y, m - 1, day);
  let count = 0;
  for (;;) {
    const s = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
    if (!datesSet.has(s)) break;
    count++;
    cur.setDate(cur.getDate() - 1);
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

export default function More() {
  const navigate = useNavigate();
  const { currentUser, logout, updateName, changePassword, withdraw, updateProfile } = useAuth();
  const { getList } = useDiary();
  const list = getList();
  const profileMenuRef = useRef(null);
  const profileGalleryInputRef = useRef(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [nameEditDone, setNameEditDone] = useState(false);

  const [newName, setNewName] = useState('');
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [modalError, setModalError] = useState('');

  const profileSrc = currentUser?.profileChar || DEFAULT_PROFILE_SRC;

  const stats = useMemo(() => ({
    total: list.length,
    streak: getConsecutiveDays(list),
    thisMonth: getThisMonthCount(list),
  }), [list]);

  const displayName = currentUser?.name ?? '사용자';
  const displayId = currentUser?.id ?? '';
  const isGuest = currentUser?.isGuest === true;

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/', { replace: true });
  };

  const openNameModal = () => {
    setShowProfileMenu(false);
    setNewName(displayName);
    setModalError('');
    setShowNameModal(true);
  };
  const openPasswordModal = () => {
    setShowProfileMenu(false);
    setPwCurrent('');
    setPwNew('');
    setPwConfirm('');
    setModalError('');
    setShowPasswordModal(true);
  };
  const openWithdrawModal = () => {
    setShowProfileMenu(false);
    setModalError('');
    setShowWithdrawModal(true);
  };

  const openProfileModal = () => {
    setShowProfileMenu(false);
    setShowProfileModal(true);
  };

  const handleProfileSelect = (src) => {
    updateProfile(src);
    setShowProfileModal(false);
  };

  const handleProfileGallery = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleProfileSelect(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleNameSubmit = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setModalError('이름을 입력해 주세요.');
      return;
    }
    const result = updateName(trimmed);
    if (result.ok) {
      setShowNameModal(false);
      setNameEditDone(true);
      setTimeout(() => setNameEditDone(false), 3000);
    } else {
      setModalError(result.error ?? '수정에 실패했어요.');
    }
  };

  const handlePasswordSubmit = () => {
    setModalError('');
    if (!pwCurrent) {
      setModalError('기존 비밀번호를 입력해 주세요.');
      return;
    }
    if (!pwNew) {
      setModalError('새 비밀번호를 입력해 주세요.');
      return;
    }
    if (pwNew.length < 4) {
      setModalError('비밀번호는 4자 이상으로 설정해 주세요.');
      return;
    }
    if (pwNew !== pwConfirm) {
      setModalError('새 비밀번호가 일치하지 않아요.');
      return;
    }
    const result = changePassword(pwCurrent, pwNew);
    if (result.ok) {
      setShowPasswordModal(false);
      setPwCurrent('');
      setPwNew('');
      setPwConfirm('');
    } else {
      setModalError(result.error ?? '변경에 실패했어요.');
    }
  };

  const handleWithdrawConfirm = () => {
    const result = withdraw();
    if (result.ok) {
      setShowWithdrawModal(false);
      navigate('/', { replace: true });
    } else {
      setModalError(result.error ?? '탈퇴 처리에 실패했어요.');
    }
  };

  return (
    <>
      <TopBar title="⚙️ 설정" />
      <main className="settings-page page-grid-bg page-transition">
        <div className="settings-wrap">
          {/* 프로필 카드 */}
          <section className="settings-card settings-profile-card" ref={profileMenuRef}>
            {!isGuest ? (
              <button
                type="button"
                className="settings-avatar-wrap"
                onClick={openProfileModal}
                aria-label="프로필 사진 변경"
              >
                <div className="settings-avatar">
                  <img src={profileSrc} alt="" className="settings-avatar-img" />
                </div>
                <span className="settings-avatar-edit-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </span>
              </button>
            ) : (
              <div className="settings-avatar">
                <img src={profileSrc} alt="" className="settings-avatar-img" />
              </div>
            )}
            <div className="settings-profile-info">
              <p className="settings-profile-name">
                {displayName}
                {nameEditDone && <span className="settings-name-done-badge">이름 수정완료 ✔</span>}
              </p>
              {displayId && <p className="settings-profile-email">{displayId}</p>}
              <p className="settings-profile-badge">그림일기 {stats.streak > 0 ? stats.streak : 0}일째 🎨</p>
            </div>
            {!isGuest && (
              <>
                <button
                  type="button"
                  className="settings-profile-more"
                  aria-label="더보기"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu((v) => !v);
                  }}
                >
                  ⋮
                </button>
                {showProfileMenu && (
                  <ul className="settings-profile-menu">
                    <li>
                      <button type="button" onClick={openNameModal}>이름 수정하기</button>
                    </li>
                    <li>
                      <button type="button" onClick={openPasswordModal}>비밀번호 변경하기</button>
                    </li>
                    <li>
                      <button type="button" onClick={openWithdrawModal}>탈퇴하기</button>
                    </li>
                  </ul>
                )}
              </>
            )}
          </section>

          {/* 나의 기록 */}
          <section className="settings-card settings-records-card">
            <h2 className="settings-card-title">나의 기록</h2>
            <div className="settings-stats">
              <div className="settings-stat">
                <span className="settings-stat-num">{stats.total}</span>
                <span className="settings-stat-label">총 일기</span>
              </div>
              <div className="settings-stat settings-stat-streak">
                <span className="settings-stat-num-wrap">
                  <span className="settings-stat-num">{stats.streak}</span>
                  <span className="settings-stat-celebrate" aria-hidden>🎉</span>
                </span>
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
              <button type="button" className="settings-etc-item" onClick={() => setShowComingSoonModal(true)}>
                <span className="settings-etc-icon">🎨</span>
                <span className="settings-etc-text">테마 색상</span>
                <span className="settings-link-arrow">›</span>
              </button>
              <button type="button" className="settings-etc-item" onClick={() => setShowComingSoonModal(true)}>
                <span className="settings-etc-icon">?</span>
                <span className="settings-etc-text">도움말</span>
                <span className="settings-link-arrow">›</span>
              </button>
            </div>
          </section>

          <button type="button" className="settings-logout" onClick={handleLogoutClick}>
            로그아웃
          </button>

          <p className="settings-version">draw a day v1.0.0</p>
        </div>
      </main>
      <BottomNav />

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div className="settings-modal-backdrop" onClick={() => setShowLogoutModal(false)} role="dialog" aria-modal="true">
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-modal-title">로그아웃 할까요?</h2>
            <div className="settings-modal-actions">
              <button type="button" className="settings-modal-btn settings-modal-btn-secondary" onClick={() => setShowLogoutModal(false)}>취소하기 ✕</button>
              <button type="button" className="settings-modal-btn settings-modal-btn-primary" onClick={handleLogoutConfirm}>로그아웃 ✔</button>
            </div>
          </div>
        </div>
      )}

      {/* 이름 수정 모달 */}
      {showNameModal && (
        <div className="settings-modal-backdrop" onClick={() => setShowNameModal(false)} role="dialog" aria-modal="true">
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-modal-title">이름 수정하기</h2>
            <div className="settings-modal-body">
              <input
                type="text"
                className="settings-modal-input"
                placeholder="새 이름"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              {modalError && <p className="settings-modal-msg" style={{ color: 'var(--color-accent)', marginTop: '-6px', marginBottom: 0 }}>{modalError}</p>}
            </div>
            <div className="settings-modal-actions">
              <button type="button" className="settings-modal-btn settings-modal-btn-secondary" onClick={() => setShowNameModal(false)}>취소하기 ✕</button>
              <button type="button" className="settings-modal-btn settings-modal-btn-primary" onClick={handleNameSubmit}>변경하기 ✔</button>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="settings-modal-backdrop" onClick={() => setShowPasswordModal(false)} role="dialog" aria-modal="true">
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-modal-title">비밀번호 변경하기</h2>
            <div className="settings-modal-body">
              <input
                type="password"
                className="settings-modal-input"
                placeholder="기존 비밀번호"
                value={pwCurrent}
                onChange={(e) => setPwCurrent(e.target.value)}
              />
              <input
                type="password"
                className="settings-modal-input"
                placeholder="새 비밀번호"
                value={pwNew}
                onChange={(e) => setPwNew(e.target.value)}
              />
              <input
                type="password"
                className="settings-modal-input"
                placeholder="새 비밀번호 재입력"
                value={pwConfirm}
                onChange={(e) => setPwConfirm(e.target.value)}
              />
              {modalError && <p className="settings-modal-msg" style={{ color: 'var(--color-accent)', marginTop: '-6px', marginBottom: 0 }}>{modalError}</p>}
            </div>
            <div className="settings-modal-actions">
              <button type="button" className="settings-modal-btn settings-modal-btn-secondary" onClick={() => setShowPasswordModal(false)}>취소하기 ✕</button>
              <button type="button" className="settings-modal-btn settings-modal-btn-primary" onClick={handlePasswordSubmit}>변경하기 ✔</button>
            </div>
          </div>
        </div>
      )}

      {/* 탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div className="settings-modal-backdrop" onClick={() => setShowWithdrawModal(false)} role="dialog" aria-modal="true">
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-modal-title">계정 탈퇴!</h2>
            <div className="settings-modal-icon">?</div>
            <p className="settings-modal-msg">정말 탈퇴하시겠습니까?</p>
            {modalError && <p className="settings-modal-msg" style={{ color: 'var(--color-accent)', marginTop: '-10px' }}>{modalError}</p>}
            <div className="settings-modal-actions">
              <button type="button" className="settings-modal-btn settings-modal-btn-secondary" onClick={() => setShowWithdrawModal(false)}>취소하기 ✕</button>
              <button type="button" className="settings-modal-btn settings-modal-btn-primary" onClick={handleWithdrawConfirm}>탈퇴하기 ✔</button>
            </div>
          </div>
        </div>
      )}

      {/* 준비중 모달 */}
      {showComingSoonModal && (
        <div className="settings-modal-backdrop" onClick={() => setShowComingSoonModal(false)} role="dialog" aria-modal="true">
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <p className="settings-modal-msg">준비중입니다...</p>
            <div className="settings-modal-actions">
              <button type="button" className="settings-modal-btn settings-modal-btn-primary" onClick={() => setShowComingSoonModal(false)}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 프로필 사진 변경 모달 */}
      {showProfileModal && (
        <div className="settings-modal-backdrop" onClick={() => setShowProfileModal(false)} role="dialog" aria-modal="true">
          <div className="settings-modal settings-profile-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="settings-modal-title">프로필 사진 변경</h2>
            <div className="settings-profile-picker-grid">
              {PROFILE_CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  type="button"
                  className={`settings-profile-picker-btn ${profileSrc === char.src ? 'settings-profile-picker-btn-selected' : ''}`}
                  onClick={() => handleProfileSelect(char.src)}
                  aria-label={char.label}
                >
                  <img src={char.src} alt={char.label} />
                </button>
              ))}
            </div>
            <input
              ref={profileGalleryInputRef}
              type="file"
              accept="image/*"
              className="settings-profile-gallery-input"
              aria-label="갤러리에서 선택"
              onChange={handleProfileGallery}
            />
            <button
              type="button"
              className="settings-profile-gallery-btn"
              onClick={() => profileGalleryInputRef.current?.click()}
            >
              갤러리에서 선택
            </button>
            <div className="settings-modal-actions" style={{ marginTop: 16 }}>
              <button type="button" className="settings-modal-btn settings-modal-btn-secondary" onClick={() => setShowProfileModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
