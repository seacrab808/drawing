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
    const profileChar = user.profileChar ?? null;
    setCurrentUser({ name: user.name, id: user.id, profileChar });
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, id: user.id, profileChar }));
    return { ok: true };
  };

  const updateProfile = (profileCharOrImage) => {
    if (!currentUser?.id || currentUser.isGuest) return { ok: false, error: '비회원은 변경할 수 없어요.' };
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx === -1) return { ok: false, error: '사용자를 찾을 수 없어요.' };
    const next = { ...currentUser, profileChar: profileCharOrImage };
    users[idx] = { ...users[idx], profileChar: profileCharOrImage };
    setCurrentUser(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(next));
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateName = (newName) => {
    if (!currentUser?.id || currentUser.isGuest) return { ok: false, error: '비회원은 수정할 수 없어요.' };
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx === -1) return { ok: false, error: '사용자를 찾을 수 없어요.' };
    users[idx] = { ...users[idx], name: newName.trim() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    setCurrentUser({ ...currentUser, name: newName.trim() });
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...currentUser, name: newName.trim() }));
    return { ok: true };
  };

  const changePassword = (currentPassword, newPassword) => {
    if (!currentUser?.id || currentUser.isGuest) return { ok: false, error: '비회원은 변경할 수 없어요.' };
    const users = getUsers();
    const user = users.find((u) => u.id === currentUser.id);
    if (!user || user.password !== currentPassword) return { ok: false, error: '기존 비밀번호가 맞지 않아요.' };
    if (newPassword.length < 4) return { ok: false, error: '비밀번호는 4자 이상으로 설정해 주세요.' };
    const idx = users.findIndex((u) => u.id === currentUser.id);
    users[idx] = { ...users[idx], password: newPassword };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return { ok: true };
  };

  const withdraw = () => {
    if (!currentUser?.id || currentUser.isGuest) return { ok: false, error: '비회원은 탈퇴할 수 없어요.' };
    const users = getUsers().filter((u) => u.id !== currentUser.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    return { ok: true };
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

  const value = { currentUser, signup, login, logout, loginAsGuest, checkIdDuplicate, updateName, changePassword, withdraw, updateProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
