import { useEffect } from 'react';

export function useShortcutKey(key = '', actionCallback = () => null) {
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key?.toLowerCase() === key?.toLowerCase()) {
        actionCallback();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [actionCallback, key]);
}
