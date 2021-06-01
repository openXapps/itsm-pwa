import React from 'react';

import StoreReducer from './StoreReducer';
import { initialUse, getSettings } from '../utilities/localstorage';
import { hasValidJWT } from '../service/AuthService';

/**
 * Initial state
 * Loads default site data if first use
 */
initialUse();
// const testAuth = 
const data = {
  theme: getSettings().data.theme,
  isAuth: hasValidJWT(),
};

export const context = React.createContext(data);

const StoreProvider = (props) => {
  const [state, dispatch] = React.useReducer(StoreReducer, data);
  return (
    <context.Provider value={[state, dispatch]}>
      {props.children}
    </context.Provider>
  );
};

export default StoreProvider;