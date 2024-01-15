import { useEffect, useState } from 'react';

export function useLocalStorage(initialState, localStorageKey) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(localStorageKey);
    return JSON.parse(stored) || initialState;
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value, localStorageKey]);

  return [value, setValue];
}
