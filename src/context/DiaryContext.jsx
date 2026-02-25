import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DIARIES_KEY = 'drawing_diary_entries';

const DiaryContext = createContext(null);

function storageKey(userId) {
  return `${DIARIES_KEY}_${userId || 'guest'}`;
}

export function DiaryProvider({ children }) {
  const [diaries, setDiaries] = useState({});
  const [userId, setUserId] = useState(null);

  const load = useCallback((uid) => {
    const key = storageKey(uid);
    try {
      const data = localStorage.getItem(key);
      setDiaries((prev) => ({ ...prev, [uid]: data ? JSON.parse(data) : [] }));
    } catch {
      setDiaries((prev) => ({ ...prev, [uid]: [] }));
    }
    setUserId(uid);
  }, []);

  const getList = useCallback(
    (uid) => {
      return diaries[uid || userId] || [];
    },
    [diaries, userId]
  );

  const getByDate = useCallback(
    (uid, dateStr) => {
      const list = getList(uid || userId);
      return list.find((d) => d.date === dateStr) || null;
    },
    [getList, userId]
  );

  const getById = useCallback(
    (uid, id) => {
      const list = getList(uid || userId);
      return list.find((d) => d.id === id) || null;
    },
    [getList, userId]
  );

  const save = useCallback(
    (entry) => {
      const uid = entry.userId || userId;
      if (!uid) return null;
      const key = storageKey(uid);
      const list = getList(uid).filter((d) => d.id !== entry.id);
      const toSave = entry.id ? entry : { ...entry, id: `diary_${Date.now()}` };
      list.push(toSave);
      const next = { ...diaries, [uid]: list };
      setDiaries(next);
      localStorage.setItem(key, JSON.stringify(list));
      return toSave;
    },
    [userId, diaries, getList]
  );

  const remove = useCallback(
    (id, uid) => {
      const u = uid || userId;
      if (!u) return;
      const key = storageKey(u);
      const list = getList(u).filter((d) => d.id !== id);
      setDiaries((prev) => ({ ...prev, [u]: list }));
      localStorage.setItem(key, JSON.stringify(list));
    },
    [userId, getList]
  );

  const toggleFavorite = useCallback(
    (id, uid) => {
      const u = uid || userId;
      if (!u) return;
      const list = getList(u).map((d) =>
        d.id === id ? { ...d, favorite: !d.favorite } : d
      );
      setDiaries((prev) => ({ ...prev, [u]: list }));
      localStorage.setItem(storageKey(u), JSON.stringify(list));
    },
    [userId, getList]
  );

  const value = {
    diaries: getList(),
    getList,
    getByDate,
    getById,
    save,
    remove,
    toggleFavorite,
    load,
    userId,
  };
  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
}

export function useDiary() {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error('useDiary must be used within DiaryProvider');
  return ctx;
}
