import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!id.trim()) {
      setError('아이디를 입력해 주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }
    const result = login(id.trim(), password);
    if (result.ok) navigate('/', { replace: true });
    else setError(result.error || '로그인에 실패했어요.');
  };

  return (
    <main className="auth-page page-grid-bg">
      <div className="auth-paper">
        <h2 className="auth-heading">로그인</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            아이디
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디"
              autoComplete="username"
              className="auth-input"
            />
          </label>
          <label className="auth-label">
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              className="auth-input"
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <div className="auth-btn-row">
            <button type="submit" className="auth-submit auth-submit-primary">
              로그인 하기 :)
            </button>
            <Link to="/signup" className="auth-submit auth-submit-secondary" style={{ textAlign: 'center', textDecoration: 'none', lineHeight: '1.25' }}>
              회원가입 하기
            </Link>
          </div>
        </form>
        <p className="auth-footer">
          <span style={{ cursor: 'default' }}>아이디/비밀번호 찾기</span>
        </p>
        <span className="auth-footer-copy">@개발자가재</span>
      </div>
    </main>
  );
}
