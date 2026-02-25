import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const PROFILE_CHARACTERS = [
  { id: 'rabbit', src: '/landing-rabbit.svg', label: '토끼' },
  { id: 'bear', src: '/profile-bear.svg', label: '곰' },
  { id: 'cat', src: '/profile-cat.svg', label: '고양이' },
  { id: 'dog', src: '/profile-dog.svg', label: '강아지' },
  { id: 'chick', src: '/profile-chick.svg', label: '병아리' },
];

export default function Signup() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [idChecked, setIdChecked] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState(null);
  const [error, setError] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const { signup, checkIdDuplicate } = useAuth();
  const navigate = useNavigate();

  const handleCheckId = () => {
    const trimmed = id.trim();
    setError('');
    setIdCheckMessage(null);
    if (!trimmed) {
      setError('아이디를 입력한 뒤 중복 확인해 주세요.');
      return;
    }
    const available = checkIdDuplicate(trimmed);
    setIdChecked(available);
    setIdCheckMessage(available ? 'available' : 'taken');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('이름을 입력해 주세요.');
      return;
    }
    if (!id.trim()) {
      setError('아이디를 입력해 주세요.');
      return;
    }
    if (!idChecked) {
      setError('아이디 중복 확인을 해 주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }
    if (password.length < 4) {
      setError('비밀번호는 4자 이상으로 설정해 주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않아요.');
      return;
    }
    signup(name.trim(), id.trim(), password, selectedProfile);
    navigate('/', { replace: true });
  };

  return (
    <main className="auth-page page-grid-bg">
        <div className="auth-paper">
          <h2 className="auth-heading">회원가입</h2>
          <div className="auth-profile-area" onClick={() => setShowProfilePicker((v) => !v)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setShowProfilePicker((v) => !v)} aria-label="프로필 캐릭터 선택">
            <button type="button" className="auth-profile-edit" aria-label="캐릭터 고르기" onClick={(e) => { e.stopPropagation(); setShowProfilePicker((v) => !v); }}>↻</button>
            {selectedProfile ? (
              <img src={selectedProfile} alt="선택한 프로필" className="auth-profile-img" />
            ) : (
              <>
                <span className="auth-profile-title">프로필</span>
                <span className="auth-profile-desc">캐릭터 5가지 정도<br />선택가능</span>
              </>
            )}
          </div>
          {showProfilePicker && (
            <div className="auth-profile-picker">
              <p className="auth-profile-picker-title">프로필 캐릭터를 골라주세요</p>
              <div className="auth-profile-picker-grid">
                {PROFILE_CHARACTERS.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    className={`auth-profile-picker-btn ${selectedProfile === char.src ? 'auth-profile-picker-btn-selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProfile(char.src);
                      setShowProfilePicker(false);
                    }}
                    aria-label={char.label}
                  >
                    <img src={char.src} alt={char.label} />
                  </button>
                ))}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              이름
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                autoComplete="name"
                className="auth-input"
              />
            </label>
            <label className="auth-label">
              아이디
              <div className="auth-id-row">
                <input
                  type="text"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                    setIdChecked(false);
                    setIdCheckMessage(null);
                  }}
                  placeholder="아이디"
                  autoComplete="username"
                  className="auth-input"
                />
                <button type="button" onClick={handleCheckId} className="auth-check-btn">
                  중복 확인
                </button>
              </div>
              {idCheckMessage === 'available' && <span className="auth-ok">사용할 수 있는 아이디예요</span>}
              {idCheckMessage === 'taken' && <span className="auth-error">사용할 수 없는 아이디입니다. 다시 입력해 주세요.</span>}
            </label>
            <label className="auth-label">
              비밀번호
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4자 이상"
                autoComplete="new-password"
                className="auth-input"
              />
            </label>
            <label className="auth-label">
              비밀번호 재입력
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 다시 입력"
                autoComplete="new-password"
                className="auth-input"
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <div className="auth-btn-row">
              <button type="submit" className="auth-submit auth-submit-primary">
                회원가입 하기
              </button>
              <Link to="/login" className="auth-submit auth-submit-secondary" style={{ textAlign: 'center', textDecoration: 'none', lineHeight: '1.25' }}>
                로그인 하기 :)
              </Link>
            </div>
          </form>
          <span className="auth-footer-copy">@개발자가재</span>
        </div>
      </main>
  );
}
