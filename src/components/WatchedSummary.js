import { calcAverage } from '../helpers';

export default function WatchedSummary({ watched }) {
  const avgImdbRating = calcAverage(watched.map((movie) => movie.imdbRating));
  const avgUserRating = calcAverage(watched.map((movie) => movie.userRating));
  const avgRuntime = calcAverage(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
