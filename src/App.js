import { useEffect, useState } from 'react';
import { tempMovieData, tempWatchedData } from './tempData';
import { calcAverage, fieldExists, handleImgError } from './helpers';
import StarRating from './StarRating';

const API_URL = 'https://www.omdbapi.com/?apikey=6e1f94e4';
const BROKEN_FILM_IMG = 'https://img.icons8.com/ios-filled/50/adb5bd/movie.png';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('inception');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setErrorMsg('');
        const res = await fetch(`${API_URL}&s=${query}`);

        if (!res.ok) throw new Error('Something went wrong');

        const data = await res.json();

        if (data.Error) throw new Error(data.Error);

        setMovies(data.Search);
      } catch (e) {
        console.error(e.message);
        setErrorMsg(e.message);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setErrorMsg('');
      return;
    }

    // fetch after 600 ms after typing
    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 600);

    // cleanup function
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((m) => m.imdbID !== id));
  };

  return (
    <>
      <Nav>
        <SearchBar query={query} onSearch={setQuery} />
        <NumResults movies={movies} />
      </Nav>

      <Main>
        <Container>
          {isLoading && <Loader />}
          {!isLoading && !errorMsg && (
            <MovieList
              movies={movies}
              selectedId={selectedId}
              onSelect={handleSelectMovie}
            />
          )}
          {errorMsg && <ErrorMsg message={errorMsg} />}
        </Container>

        <Container>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              watched={watched}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Container>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <div className="loader">
      <img
        className="loading-icon"
        src="/loading-icon.svg"
        alt="loading icon"
      />
      <p>Loading...</p>
    </div>
  );
}

function ErrorMsg({ message }) {
  return (
    <p className="error">
      <span>🔺</span>
      {message}
    </p>
  );
}

function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      {children}
    </nav>
  );
}

function SearchBar({ query, onSearch }) {
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

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Container({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <BtnToggle isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelect, selectedId }) {
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

function Movie({ movie, selectedId, onSelect }) {
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

function MovieDetails({ selectedId, watched, onCloseMovie, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userRating, setUserRating] = useState(0);

  const selectedMovie = watched.find((m) => m.imdbID === selectedId);
  const isWatchedAlready = !!selectedMovie;

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

  useEffect(() => {
    const fetchMovieDetailsUsingId = async () => {
      try {
        setIsLoading(true);
        setErrorMsg('');
        const res = await fetch(`${API_URL}&i=${selectedId}`);

        if (!res.ok) throw new Error('Something went wrong');

        const data = await res.json();

        if (data.Error) throw new Error(data.Error);

        setMovie(data);
      } catch (e) {
        console.error(e.message);
        setErrorMsg(e.message);
        setMovie({});
      } finally {
        setIsLoading(false);
      }
    };

    if (!selectedId) {
      return;
    }

    fetchMovieDetailsUsingId();
  }, [selectedId]);

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      runtime: +movie.Runtime.split(' ')[0],
      imdbRating: +movie.imdbRating,
      userRating: userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  return (
    <div className="details">
      {isLoading && <Loader />}
      {errorMsg && <ErrorMsg message={errorMsg} />}
      {!isLoading && !errorMsg && (
        <>
          <button
            title="Close movie"
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
                <p>You rated this movie {selectedMovie.userRating} ⭐</p>
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

function WatchedSummary({ watched }) {
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

function WatchedMovieList({ watched, onDeleteWatched }) {
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

function WatchedMovie({ movie, onDeleteWatched }) {
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

function BtnToggle({ isOpen, onClick }) {
  return (
    <button className="btn-toggle" onClick={onClick}>
      {isOpen ? '–' : '+'}
    </button>
  );
}
