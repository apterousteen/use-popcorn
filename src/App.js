import { useEffect, useState } from 'react';
import { API_URL } from './config';
import Loader from './components/Loader';
import ErrorMsg from './components/ErrorMsg';
import Nav from './components/Nav';
import SearchBar from './components/SearchBar';
import NumResults from './components/NumResults';
import Main from './components/Main';
import Container from './components/Container';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import WatchedSummary from './components/WatchedSummary';
import WatchedMovieList from './components/WatchedMovieList';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    const stored = localStorage.getItem('watchedMovies');
    return JSON.parse(stored) || [];
  });

  const isMobile = window.matchMedia(
    'only screen and (max-width: 61.25em)'
  ).matches;

  useEffect(() => {
    localStorage.setItem('watchedMovies', JSON.stringify(watched));
  }, [watched]);

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
      handleCloseMovie();
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
        {isMobile ? (
          movies.length > 0 && (
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
          )
        ) : (
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
        )}

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
