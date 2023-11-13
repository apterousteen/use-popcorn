import { useEffect, useState } from 'react';
import { tempMovieData, tempWatchedData } from './tempData';
import { calcAverage } from './helpers';
import StarRating from './StarRating';

// TODO: pagination
const API_URL = 'https://www.omdbapi.com/?apikey=6e1f94e4';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
      console.log(query);
      fetchMovies();
    }, 600);

    // cleanup function
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <>
      <Nav>
        <SearchBar query={query} onSearch={setQuery} />
        <NumResults movies={movies} />
      </Nav>

      <Main>
        <Container>
          {isLoading && <Loader />}
          {!isLoading && !errorMsg && <MovieList movies={movies} />}
          {errorMsg && <ErrorMsg message={errorMsg} />}
        </Container>

        <Container>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
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

function MovieList({ movies }) {
  return (
    <ul className="list">
      {movies?.map((m) => (
        <Movie movie={m} key={m.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img
        src={
          movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://img.icons8.com/ios-filled/50/adb5bd/movie.png'
        }
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

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((m) => (
        <WatchedMovie movie={m} key={m.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
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
