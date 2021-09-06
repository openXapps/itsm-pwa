import { useEffect, useState } from 'react';

// NOT USED AT THE MOMENT

/**
 * Fetch hook
 * @param {string} url URL string to fetch
 * @param {any} options Fetch options
 * @returns Array of [isLoading, data, error]
 */
const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        if (isMounted) {
          setData(data);
          setError(null);
        }
      })
      .catch(error => {
        if (isMounted) {
          setError(error);
          setData(null);
        }
      })
      .finally(() => isMounted && setIsLoading(false));

    // Component unmount clean-up
    return () => { isMounted = false };
  }, [url, options]);

  return [isLoading, data, error];
};

export default useFetch;
