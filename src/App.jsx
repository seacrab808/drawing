import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DiaryProvider, useDiary } from './context/DiaryContext';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import ScrollToTop from './components/ScrollToTop';

import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DiaryWrite from './pages/DiaryWrite';
import DrawingCanvas from './pages/DrawingCanvas';
import DiaryDetail from './pages/DiaryDetail';
import More from './pages/More';
import Favorites from './pages/Favorites';

function LoadUserDiaries() {
  const { currentUser } = useAuth();
  const { load } = useDiary();
  useEffect(() => {
    if (currentUser?.id) load(currentUser.id);
  }, [currentUser?.id, load]);
  return null;
}

function WelcomeOrHome() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Welcome />;
  return <Home />;
}

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<WelcomeOrHome />} />
      <Route
        path="/diary/write/:dateStr"
        element={
          <ProtectedRoute>
            <DiaryWrite />
            <BottomNav />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diary/draw/:dateStr"
        element={
          <ProtectedRoute>
            <DrawingCanvas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diary/detail/:id"
        element={
          <ProtectedRoute>
            <DiaryDetail />
            <BottomNav />
          </ProtectedRoute>
        }
      />
      <Route
        path="/more"
        element={
          <ProtectedRoute>
            <More />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <DiaryProvider>
          <LoadUserDiaries />
          <AppRoutes />
        </DiaryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
