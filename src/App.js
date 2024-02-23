import { useCallback, useState } from 'react';
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
import { useLocalStorage } from './hooks/useLocalStorage';
import Pagination from './components/Pagination';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);

  const [watched, setWatched] = useLocalStorage([], 'watchedMovies');

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

  const [movies, isLoading, errorMsg, pageCount, totalResults] = useMovies(
    query,
    handleCloseMovie,
    page,
    setPage
  );

  const handlePrevPage = () => {
    setPage((p) => (p > 1 ? p - 1 : p));
  };

  const handleNextPage = () => {
    setPage((p) => (p < pageCount ? p + 1 : p));
  };

  return (
    <>
      <Nav>
        <SearchBar query={query} onSearch={setQuery} />
        <NumResults totalResults={totalResults} />
      </Nav>

      <Main>
        {isMobile ? (
          query !== '' && (
            <Container>
              {isLoading && <Loader />}
              {!isLoading && !errorMsg && (
                <>
                  <MovieList
                    movies={movies}
                    selectedId={selectedId}
                    onSelect={handleSelectMovie}
                  />
                  {movies.length > 0 && (
                    <Pagination
                      page={page}
                      pageCount={pageCount}
                      onNextPage={handleNextPage}
                      onPrevPage={handlePrevPage}
                    />
                  )}
                </>
              )}
              {errorMsg && <ErrorMsg message={errorMsg} />}
            </Container>
          )
        ) : (
          <Container>
            {isLoading && <Loader />}
            {!isLoading && !errorMsg && (
              <>
                <MovieList
                  movies={movies}
                  selectedId={selectedId}
                  onSelect={handleSelectMovie}
                />
                {movies.length > 0 && (
                  <Pagination
                    page={page}
                    pageCount={pageCount}
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                  />
                )}
              </>
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
