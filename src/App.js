import { useCallback, useEffect, useState } from 'react';
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
import { useMovies } from './hooks/useMovies';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    const stored = localStorage.getItem('watchedMovies');
    return JSON.parse(stored) || [];
  });

  const isMobile = window.matchMedia(
    'only screen and (max-width: 61.25em)'
  ).matches;

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };
  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((m) => m.imdbID !== id));
  };

  const handleCloseMovie = useCallback(() => {
    setSelectedId(null);
  }, []);

  const [movies, isLoading, errorMsg] = useMovies(query, handleCloseMovie);

  useEffect(() => {
    localStorage.setItem('watchedMovies', JSON.stringify(watched));
  }, [watched]);

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
