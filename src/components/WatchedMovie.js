import { fieldExists, handleImgError } from '../helpers';
import { BROKEN_FILM_IMG } from '../config';

export default function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img
        onError={handleImgError}
        src={fieldExists(movie.poster) ? movie.poster : BROKEN_FILM_IMG}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{fieldExists(movie.imdbRating) && movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{fieldExists(movie.userRating) && movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{fieldExists(movie.runtime) && movie.runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        title="delete movie"
        onClick={() => onDeleteWatched(movie.imdbID)}
      >
        &times;
      </button>
    </li>
  );
}
