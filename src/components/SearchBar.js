import { useRef } from 'react';
import { useShortcutKey } from '../hooks/useShortcutKey';

export default function SearchBar({ query, onSearch }) {
  // 1 create
  const searchField = useRef(null);

  // 3 useEffect because the ref will be added only after the component mounts
  // useEffect(() => {
  //   const handleKeydownEnter = (e) => {
  //     if (e.key === 'Enter') {
  //       searchField.current.focus();
  //     }
  //   };
  //
  //   document.addEventListener('keydown', handleKeydownEnter);
  //
  //   return () => {
  //     document.removeEventListener('keydown', handleKeydownEnter);
  //   };
  // }, []);

  useShortcutKey('Enter', () => {
    searchField.current.focus();
  });

  return (
    <div className="searchbar-container">
      {/* 2 - connect ref with actual element */}
      <input
        name="search-bar"
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        ref={searchField}
      />
      <span className="search-hint">Enter</span>
    </div>
  );
}
