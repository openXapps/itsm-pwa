/**
 * A custom hook to query an URL Search Parameter object
 * @param {any} locationSearch React Router DOM unmutable location object
 * @returns Provides a new URLSearchParams object
 */
export const useURLQuery = (locationSearch) => {
  return new URLSearchParams(locationSearch);
};