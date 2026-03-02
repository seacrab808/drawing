import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

const IconPalette = () => (
  <svg width="28" height="28" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.8611 5.8335C8.55691 5.8335 4.57566 16.596 6.17982 20.3002C7.37566 23.0564 10.0007 20.4168 11.0507 21.7585C13.7923 25.346 7.97357 27.3147 11.1819 28.5835C14.959 30.1293 29.1632 29.1668 29.1632 16.1439C29.1632 12.221 27.209 5.8335 17.8611 5.8335ZM12.3486 18.9585C11.16 18.9337 10.2048 17.9639 10.2048 16.771C10.2048 15.5635 11.1848 14.5835 12.3923 14.5835C13.5998 14.5835 14.5798 15.562 14.5798 16.771C14.5798 17.9785 13.5998 18.9585 12.3923 18.9585C12.3763 18.9585 12.3617 18.9585 12.3457 18.9585H12.3486ZM14.5798 10.9377C14.5798 9.73016 15.5598 8.75016 16.7673 8.75016C17.9748 8.75016 18.9548 9.73016 18.9548 10.9377C18.9548 12.1452 17.9748 13.1252 16.7673 13.1252C16.7513 13.1252 16.7367 13.1252 16.7207 13.1252C15.5336 13.1004 14.5798 12.1306 14.5798 10.9377ZM18.1819 26.2502C16.9934 26.2254 16.0382 25.2556 16.0382 24.0627C16.0382 22.8552 17.0182 21.8752 18.2257 21.8752C19.4332 21.8752 20.4132 22.8537 20.4132 24.0627C20.4132 25.2702 19.4332 26.2502 18.2257 26.2502C18.2096 26.2502 18.195 26.2502 18.179 26.2502H18.1819ZM24.0152 21.8752C22.8267 21.8504 21.8715 20.8806 21.8715 19.6877C21.8715 18.4802 22.8515 17.5002 24.059 17.5002C25.2665 17.5002 26.2465 18.4787 26.2465 19.6877C26.2465 20.8952 25.2665 21.8752 24.059 21.8752C24.0429 21.8752 24.0284 21.8752 24.0123 21.8752H24.0152ZM24.0152 14.5835C22.8267 14.5587 21.8715 13.5889 21.8715 12.396C21.8715 11.1885 22.8515 10.2085 24.059 10.2085C25.2665 10.2085 26.2465 11.187 26.2465 12.396C26.2465 13.6035 25.2665 14.5835 24.059 14.5835C24.0429 14.5835 24.0284 14.5835 24.0123 14.5835H24.0152Z" fill="currentColor"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.9998 8.3335V13.3335H24.9998V8.3335H14.9998V13.3335H9.99984V8.3335H6.6665V33.3335H33.3332V8.3335H29.9998ZM11.6665 31.6668H8.33317V28.3335H11.6665V31.6668ZM11.6665 26.6668H8.33317V23.3335H11.6665V26.6668ZM11.6665 21.6668H8.33317V18.3335H11.6665V21.6668ZM16.6665 31.6668H13.3332V28.3335H16.6665V31.6668ZM16.6665 26.6668H13.3332V23.3335H16.6665V26.6668ZM16.6665 21.6668H13.3332V18.3335H16.6665V21.6668ZM21.6665 31.6668H18.3332V28.3335H21.6665V31.6668ZM21.6665 26.6668H18.3332V23.3335H21.6665V26.6668ZM21.6665 21.6668H18.3332V18.3335H21.6665V21.6668ZM26.6665 31.6668H23.3332V28.3335H26.6665V31.6668ZM26.6665 26.6668H23.3332V23.3335H26.6665V26.6668ZM26.6665 21.6668H23.3332V18.3335H26.6665V21.6668ZM31.6665 31.6668H28.3332V28.3335H31.6665V31.6668ZM31.6665 26.6668H28.3332V23.3335H31.6665V26.6668ZM31.6665 21.6668H28.3332V18.3335H31.6665V21.6668Z" fill="currentColor"/>
    <path d="M11.6665 6.6665H13.3332V11.6665H11.6665V6.6665Z" fill="currentColor"/>
    <path d="M26.6665 6.6665H28.3332V11.6665H26.6665V6.6665Z" fill="currentColor"/>
  </svg>
);

/** 더보기 탭용 아이콘 (리스트/메뉴) */
const IconMore = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 6h16v1.5H4V6zm0 5.25h16v1.5H4v-1.5zm0 5.25h16V18H4v-1.5z" fill="currentColor"/>
  </svg>
);

export default function BottomNav() {
  const location = useLocation();
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isDiaryActive = location.pathname.startsWith('/diary');
  const isMoreActive = location.pathname === '/more' || location.pathname === '/favorites';

  return (
    <nav className="bottom-nav" role="navigation" aria-label="하단 메뉴">
      <NavLink
        to={`/diary/write/${dateStr}`}
        className={({ isActive }) => `bottom-nav-item ${isDiaryActive || isActive ? 'active' : ''}`}
      >
        <span className="bottom-nav-icon" aria-hidden>
          <IconPalette />
        </span>
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <span className="bottom-nav-icon" aria-hidden>
          <IconCalendar />
        </span>
      </NavLink>
      <NavLink
        to="/more"
        className={() => `bottom-nav-item ${isMoreActive ? 'active' : ''}`}
        end
      >
        <span className="bottom-nav-icon" aria-hidden>
          <IconMore />
        </span>
      </NavLink>
    </nav>
  );
}
