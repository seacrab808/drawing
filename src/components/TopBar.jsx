import { useNavigate } from 'react-router-dom';
import './TopBar.css';

export default function TopBar({ title, showBack = false, rightButton, titleAlign }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {showBack ? (
          <button type="button" className="topbar-back" onClick={() => navigate(-1)} aria-label="뒤로">
            ←
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
