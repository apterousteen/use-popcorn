export default function SearchBar({ query, onSearch }) {
  return (
    <input
      name="search-bar"
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}