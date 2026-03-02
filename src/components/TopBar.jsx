import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

const SCROLL_THRESHOLD = 24;

export default function TopBar({ title, showBack = false, rightButton, titleAlign }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}>
      <div className={`topbar-inner${!showBack && titleAlign === 'left' ? ' topbar-inner-title-left' : ''}`}>
        {showBack ? (
          <button type="button" className="topbar-back" onClick={() => navigate(-1)} aria-label="뒤로">
            <img src="/back-arrow.svg" alt="" width={11} height={18} className="topbar-back-icon" />
          </button>
        ) : (
          <span className="topbar-spacer" />
        )}
        <h1 className={`topbar-title${titleAlign === 'left' ? ' topbar-title-left' : ''}`}>{title}</h1>
        {rightButton ? (
          <div className="topbar-right">{rightButton}</div>
        ) : (
          <span className="topbar-spacer" />
        )}
      </div>
    </header>
  );
}
