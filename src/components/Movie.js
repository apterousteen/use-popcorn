import { fieldExists, handleImgError } from '../helpers';
import { BROKEN_FILM_IMG } from '../config';

export default function Movie({ movie, selectedId, onSelect }) {
  return (
    <li
      className={selectedId === movie.imdbID ? 'selected' : null}
      onClick={() => onSelect(movie.imdbID)}
      key={movie.imdbID}
    >
      <img
        onError={handleImgError}
        src={fieldExists(movie.Poster) ? movie.Poster : BROKEN_FILM_IMG}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📆</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
