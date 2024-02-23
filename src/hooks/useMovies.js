import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../config';

export function useMovies(query, handleCloseMovie, page, setPage) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const pageCount = useRef(1);

  useEffect(() => {
    setPage(1);
  }, [query, setPage]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setErrorMsg('');
        const res = await fetch(`${API_URL}&s=${query}&page=${page}`);

        if (!res.ok) throw new Error('Something went wrong');

        const data = await res.json();

        if (data.Error) throw new Error(data.Error);

        setMovies(data.Search);
        setTotalResults(+data.totalResults);
        pageCount.current = Math.ceil(+data.totalResults / 10);
      } catch (e) {
        console.error(e.message);
        setErrorMsg(e.message);
        setMovies([]);
        setTotalResults(0);
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
  }, [handleCloseMovie, page, query]);

  return [movies, isLoading, errorMsg, pageCount.current, totalResults];
}
