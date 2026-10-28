import { useEffect, useState } from 'react';

// Evita repetir loading/erro/dados em cada página. O cache fica nos services.
export default function useAsyncData(load) {
  const [state, setState] = useState({ loading: true, data: null, error: '' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ loading: true, data: null, error: '' });
    load()
      .then((data) => {
        if (active) setState({ loading: false, data, error: '' });
      })
      .catch((error) => {
        if (active) setState({ loading: false, data: null, error: error.message });
      });
    return () => {
      active = false;
    };
  }, [load, attempt]);
  return { ...state, retry: () => setAttempt(attempt + 1) };
}
