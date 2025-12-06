import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue, userId) {
  const storageKey = userId ? `${key}_${userId}` : key;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Baca dari Local Storage saat inisialisasi
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${storageKey}": `, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${storageKey}": `, error);
    }
  }, [storageKey, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
