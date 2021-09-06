import { useEffect, useContext, useState, useCallback } from 'react';

import { context } from '../context/StoreProvider';
import { getLocalStorage } from '../utilities/localstorage';
import { validateToken } from '../service/RSSOService';

// NOT USED AT THE MOMENT

/**
 * React Hook to validate token
 * @param {boolean} runApiTest Should an API test be performed
 */
const useAuth = (runApiTest) => {
  const [state, dispatch] = useContext(context);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const runValidation = useCallback(
    () => {
      const { theme } = getLocalStorage('settings').data;
      validateToken(runApiTest).then(response => {
        console.log('useAuth runValidation: validateToken response.......', response);
        console.log('useAuth runValidation: validateToken theme..........', theme);
        console.log('useAuth runValidation: validateToken state theme....', state.theme);
        console.log('useAuth runValidation: validateToken state isAuth...', state.isAuth);
        if (response) {
          if (theme !== state.theme) dispatch({ type: 'THEME', payload: theme });
          if (!state.isAuth) dispatch({ type: 'AUTH', payload: true });
          setIsTokenValid(response);
        }
      })
    }, [dispatch, runApiTest, state.isAuth, state.theme]);

  useEffect(() => {
    console.log('useAuth useEffect ran...');
    runValidation();
    return () => { };
  }, [runValidation]);

  return isTokenValid;
};

export default useAuth;