import { useEffect, useState } from 'react';
import { API_URL } from '../config';

export function useMovies(query, handleCloseMovie) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      handleCloseMovie();
      fetchMovies();
    }, 600);

    // cleanup function
    return () => clearTimeout(delayDebounce);
  }, [query, handleCloseMovie]);

  return [movies, isLoading, errorMsg];
}
