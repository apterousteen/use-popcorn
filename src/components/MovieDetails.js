import {useEffect, useRef, useState} from 'react';
import {API_URL} from '../config';
import {fieldExists, handleImgError} from '../helpers';
import Loader from './Loader';
import ErrorMsg from './ErrorMsg';
import StarRating from './StarRating';

export default function MovieDetails({
                                       selectedId,
                                       watched,
                                       onCloseMovie,
                                       onAddWatched,
                                     }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userRating, setUserRating] = useState(0);

  const selectedWatchedMovie = watched.find((m) => m.imdbID === selectedId);
  const isWatchedAlready = !!selectedWatchedMovie;

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const ratingClickCount = useRef(0);

  useEffect(() => {
    if (userRating) ratingClickCount.current++;
  }, [userRating]);

  useEffect(() => {
    if (!title) return;

    document.title = `usePopcorn // ${title}`;

    return () => {
      document.title = `usePopcorn // movie tracker`;
    };
  }, [title]);

  useEffect(() => {
    // 1. создаем контроллер вне fetch функции
    const controller = new AbortController();

    const fetchMovieDetailsUsingId = async () => {
      try {
        setIsLoading(true);
        setErrorMsg('');
        const res = await fetch(`${API_URL}&i=${selectedId}`, {
          // 2. добавляем сигнал в fetch options
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Something went wrong');

        const data = await res.json();

        if (data.Error) throw new Error(data.Error);

        setMovie(data);

        // 5. зачищаем ошибку в state
        setErrorMsg('');
      } catch (e) {
        // 4. обрабатываем ошибку только если это не AbortError
        if (e.name !== 'AbortError') setErrorMsg(e.message);
        setMovie({});
      } finally {
        setIsLoading(false);
      }
    };

    if (!selectedId) {
      return;
    }

    fetchMovieDetailsUsingId();

    return () => {
      // 3. в cleanup функции прерываем предыдущий запрос при ре-рендере
      controller.abort();
    };
  }, [selectedId]);

  useEffect(() => {
    const handleKeydownEsc = (e) => {
      if (e.key === 'Escape') {
        onCloseMovie();
      }
    };

    document.addEventListener('keydown', handleKeydownEsc);

    return () => {
      document.removeEventListener('keydown', handleKeydownEsc);
    };
  }, [onCloseMovie]);
  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      runtime: +movie.Runtime.split(' ')[0],
      imdbRating: +movie.imdbRating,
      userRating: userRating,
      countRatingDecisions: ratingClickCount.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  return (
      <div className="details">
        {isLoading && <Loader/>}
        {errorMsg && <ErrorMsg message={errorMsg}/>}
        {!isLoading && !errorMsg && (
            <>
              <button
                  title="Close movie (Esc)"
                  className="btn-back"
                  onClick={onCloseMovie}
              >
                &larr;
              </button>
              <header>
                {fieldExists(poster) && (
                    <img
                        onError={(e) => handleImgError(e, true)}
                        src={poster}
                        alt="poster"
                    />
                )}
                <div className="details-overview">
                  <h2>{title}</h2>
                  <p>
                    {released}
                    {fieldExists(runtime) && (
                        <>
                          <span> &bull; </span> {runtime}
                        </>
                    )}
                  </p>
                  {fieldExists(genre) && <p>{genre}</p>}
                  <p>
                    ⭐{' '}
                    {fieldExists(imdbRating)
                        ? `${imdbRating} IMDb rating`
                        : `No IMDb rating`}
                  </p>
                </div>
              </header>
              <section>
                <div className="rating">
                  {!isWatchedAlready ? (
                      <>
                        <StarRating
                            maxRating={10}
                            starSize={24}
                            onSetRating={setUserRating}
                        />
                        {userRating > 0 && (
                            <button className="btn-add" onClick={handleAdd}>
                              + Add to list
                            </button>
                        )}
                      </>
                  ) : (
                      <p>You rated this movie {selectedWatchedMovie.userRating} ⭐</p>
                  )}
                </div>
                <p>
                  <em>{fieldExists(plot) ? plot : 'No description'}</em>
                </p>
                {fieldExists(actors) && <p>Starring {actors}</p>}
                {fieldExists(director) && <p>Directed by {director}</p>}
              </section>
            </>
        )}
      </div>
  );
}
