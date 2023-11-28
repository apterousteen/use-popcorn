import WatchedMovie from './WatchedMovie';

export default function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((m) => (
        <WatchedMovie
          movie={m}
          key={m.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
