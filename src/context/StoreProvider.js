import { createContext, useReducer } from 'react';

import StoreReducer from './StoreReducer';
import { initialUse, getLocalStorage } from '../utilities/localstorage';
import { hasTokenExpired } from '../service/RSSOService';

/**
 * Initial state
 * Loads default site data on first use
 */
initialUse();

// Initialize context data
const contextData = {
  theme: getLocalStorage('settings').data.theme,
  isAuth: !hasTokenExpired().accessTokenExpired,
  showProgress: false,
};

export const context = createContext(contextData);

/**
 * Context store wrapper for entire app used in index.js
 * @param {any} props Child components to be wrapped
 * @returns Returns a React Context Provider
 */
const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(StoreReducer, contextData);
  return (
    <context.Provider value={[state, dispatch]}>
      {props.children}
    </context.Provider>
  );
};

export default StoreProvider;