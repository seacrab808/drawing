import TopBar from '../components/TopBar';
import './Settings.css';

export default function Settings() {
  return (
    <>
      <TopBar title="설정" showBack />
      <main className="settings-page page-grid-bg">
        <div className="settings-paper">
          <p className="settings-desc">그림일기 앱 설정이에요. 추후 알림, 테마 등을 추가할 수 있어요.</p>
        </div>
      </main>
    </>
  );
}
