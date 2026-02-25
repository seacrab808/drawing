import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

  const handleGuest = () => {
    if (loginAsGuest) loginAsGuest();
    navigate('/', { replace: true });
  };

  return (
    <main className="welcome-page">
      {/* 상단: 격자 배경 + 구름 타이틀 + 아이콘/토끼 */}
      <div className="welcome-top">
        <div className="welcome-cloud-wrap">
          <img src="/landing-cloud.svg" alt="" className="welcome-cloud-img" aria-hidden />
          <h1 className="welcome-title">draw a day</h1>
        </div>

        <div className="welcome-hero-container">
          <img src="/landing-clock.svg" alt="clock" className="welcome-clock" />
          <img src="/landing-calendar.svg" alt="calendar" className="welcome-calendar-img" />
          <div className="welcome-rabbit-wrap">
            <img src="/landing-rabbit.svg" alt="rabbit" className="welcome-rabbit-img" />
          </div>
        </div>
      </div>

      {/* 하단: 베이지 배경 + 버튼들 (하트라인 제거됨) */}
      <div className="welcome-bottom">
        <div className="welcome-actions">
          <Link to="/login" className="welcome-btn welcome-btn-primary">
            로그인 하기 :)
          </Link>
          <Link to="/signup" className="welcome-btn welcome-btn-outline">
            회원가입 하기
          </Link>
          <button type="button" className="welcome-guest" onClick={handleGuest}>
            비회원으로 그려보기
          </button>
        </div>

        <footer className="welcome-footer">@개발자가재</footer>
      </div>
    </main>
  );
}