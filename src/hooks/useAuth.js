/**
 * THIS HOOK IS NOT USED AT THE MOMENT.
 * IT WAS A CONCEPT I HAD TO MANAGE AUTH
 * STATE
 */

import { useState } from 'react';
import { useContext } from 'react';

import { context } from '../context/StoreProvider';

const useAuth = () => {
  const [state, dispatch] = useContext(context);
  const [isAuth, setIsAuth] = useState(state.isAuth);

  const hasValidJWT = (includeTest) => {
    let response = false;
    const rsso = getLocalRSSO();
    if (rsso.statusOK) {
      if (rsso.data.tokenDate && rsso.data.accessToken) {
        if (!hasJWTExpired(rsso.data.tokenDate, rsso.data.expiresIn)) {
          if (includeTest) {
            if (testJWT(rsso.data.accessToken)) response = true;
          } else {
            response = true;
          }
        }
      }
    }
    return response;
  };
  
  /**
   * Helper function to validate whether JWT has expired
   * @param {string} tokenDate Last token request date
   * @param {number} expiresIn Last token expires in seconds
   * @returns boolean whether JWT expired or not
   */
  const hasJWTExpired = (tokenDate, expiresIn) => {
    let response = true;
    // console.log('hasJWTExpired: testing JWT date:expires...', tokenDate, expiresIn);
    if (tokenDate) {
      const d1 = new Date().getTime();
      const d2 = new Date(tokenDate).getTime();
      let dif = ((d1 - d2) / 1000);
      // console.log('hasJWTExpired: dif...', dif);
      if (dif < expiresIn) response = false;
    }
    // console.log('hasJWTExpired: response...', response);
    return response
  };
  
  /**
   * Helper function to test a JWT validity
   * @param {string} token Token to be used for testing connection
   * @returns A boolean to indicate whether the test was successful or not
   */
  const testJWT = async (token) => {
    const settings = getLocalSettings().data;
    const { tokenType } = getLocalRSSO().data;
    const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
    const query = `'submitter'=$USER$`;
    const fields = 'requestId,theme,showApproval,showIncident,showChange,showProblem,showAsset,showPeople';
    const url = `/api/arsys/v1/entry/SBSA:PWA:UserSettings?q=(${query})&fields=values(${fields})`;
    // console.log('testJWT: url...', url);
  
    const response = await fetch(host + url, {
      method: 'GET',
      headers: { 'Authorization': tokenType + ' ' + token },
      mode: 'cors',
    });
    // response.json().then(data => { console.log('testJWT: response...', data) });
  
    if (response.ok) {
      response.json().then(data => {
        if (data.entries.length > 0) {
          if (!settings.settingsId) {
            saveSettings(data.entries[0].values);
          } else {
            if (settings.settingsId !== data.entries[0].values.requestId) {
              saveSettings(data.entries[0].values);
            }
          }
        }
      });
    }
    return response.ok;
  };
  
  /**
   * Internal helper function to save settings into storage
   * @param {any} data Seetings object to save
   */
  function saveSettings(data) {
    saveLocalStorage(storageObjects.settings, {
      settingsId: data.requestId,
      theme: data.theme,
      approvals: data.showApproval === 'true' ? true : false,
      incidents: data.showIncident === 'true' ? true : false,
      changes: data.showChange === 'true' ? true : false,
      problems: data.showProblem === 'true' ? true : false,
      assets: data.showAsset === 'true' ? true : false,
      people: data.showPeople === 'true' ? true : false,
    });
  }

};

export default useAuth;