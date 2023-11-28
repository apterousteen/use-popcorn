import Movie from './Movie';

export default function MovieList({ movies, onSelect, selectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((m) => (
        <Movie
          movie={m}
          selectedId={selectedId}
          onSelect={onSelect}
          key={m.imdbID}
        />
      ))}
    </ul>
  );
}
