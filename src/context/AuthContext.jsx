import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'drawing_diary_users';
const CURRENT_USER_KEY = 'drawing_diary_current_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  const getUsers = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const signup = (name, id, password, profileChar = null) => {
    const users = getUsers();
    const user = { name, id, password, profileChar, createdAt: Date.now() };
    users.push(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    setCurrentUser({ name, id, profileChar });
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name, id, profileChar }));
    return { ok: true };
  };

  const login = (id, password) => {
    const users = getUsers();
    const user = users.find((u) => u.id === id && u.password === password);
    if (!user) return { ok: false, error: '아이디 또는 비밀번호가 맞지 않아요.' };
    setCurrentUser({ name: user.name, id: user.id, profileChar: user.profileChar });
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, id: user.id, profileChar: user.profileChar }));
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const loginAsGuest = () => {
    const guest = { name: '비회원', id: 'guest', isGuest: true };
    setCurrentUser(guest);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(guest));
  };

  const checkIdDuplicate = (id) => {
    if (id === 'guest') return false;
    const users = getUsers();
    return !users.some((u) => u.id === id);
  };

  const value = { currentUser, signup, login, logout, loginAsGuest, checkIdDuplicate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
