import { saveLocalStorage, getLocalStorage } from '../utilities/localstorage';
import { localEnvironment, storageObjects, defaultStorage } from '../utilities/defaultdata';

// https://docs.bmc.com/docs/ars2002/enabling-oauth-authorization-for-remedy-ar-system-rest-apis-909638148.html#EnablingOAuthauthorizationforRemedyARSystemRESTAPIs-TouseRemedySSOOAuth2.0authorizationinyourapplication

/**
* Function to get a token with OAuth code flow
* @param {string} code OAuth code
* @returns Boolean of true if token fetched
*/
export const getTokenWithCode = async (code) => {
  let result = false;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST;
  const url = '/rsso/oauth2/v1.1/token';
  const redirect = encodeURIComponent(host + '/pwa');
  const secret = encodeURIComponent(localEnvironment.RSSOSECRET);
  const body = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect}&client_secret=${secret}&client_id=${localEnvironment.RSSOCLIENTID}`;

  const response = await fetch(host + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  });

  if (response.ok) {
    result = true;
    response.json().then(token => {
      saveLocalStorage(storageObjects.rsso, {
        accessToken: token.access_token,
        tokenType: token.token_type,
        expiresIn: token.expires_in,
        tokenDate: new Date(),
        refreshToken: token.refresh_token,
      });
    });
  } else saveLocalStorage(storageObjects.rsso, defaultStorage.rsso);

  return result;
}

/**
* Function to refresh the current token
* If the refresh is successful then update local session cache
* @returns RSSO token refresh response boolean
*/
export const refreshToken = async () => {
  let result = false;
  const { refreshToken } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST;
  const url = '/rsso/oauth2/v1.1/token';
  const secret = encodeURIComponent(localEnvironment.RSSOSECRET);
  const body = `grant_type=refresh_token&refresh_token=${refreshToken}&client_secret=${secret}&client_id=${localEnvironment.RSSOCLIENTID}`;

  await fetch(host + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body,
  }).then(response => {
    if (response.ok) {
      result = true;
      response.json().then(data => {
        saveLocalStorage(storageObjects.rsso, {
          accessToken: data.access_token,
          tokenType: data.token_type,
          expiresIn: data.expires_in,
          tokenDate: new Date(),
          refreshToken: data.refresh_token,
        });
      });
    }
  }).catch(error => {
    console.log(error);
    // saveLocalStorage(storageObjects.rsso, defaultStorage.rsso);
  });

  // console.log('refreshToken: result...', result);
  return result;
};

/**
 * Function to revoke a token from RSSO
 * @param {string} hint What token to revoke (access_token or refresh_token)
 * @returns Boolean of true if token was recoved
 */
export const revokeToken = (hint) => {
  const { accessToken } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST;
  const url = '/rsso/oauth2/revoke';
  const secret = encodeURIComponent(localEnvironment.RSSOSECRET);
  const body = `token=${accessToken}&token_type_hint=${hint}&client_secret=${secret}&client_id=${localEnvironment.RSSOCLIENTID}`;

  return fetch(host + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + accessToken
    },
    body: body,
  });
};

/**
 * Function to validate whether token expired or not
 * @returns Boolean whether token expired or not
 */
export const hasTokenExpired = () => {
  let result = { accessTokenExpired: true, refreshTokenExpired: true };
  const refreshTokenValidFor = 1800; // 30 minutes
  const { tokenDate, expiresIn } = getLocalStorage('rsso').data;

  if (tokenDate && expiresIn) {
    const d0 = new Date().getTime();
    const d1 = new Date(tokenDate).getTime();
    const d2 = d1 + (expiresIn * 1000);
    const d3 = d1 + (refreshTokenValidFor * 1000);
    // console.log('hasTokenExpired: tokenDate......', new Date(d1));
    // console.log('hasTokenExpired: accessToken....', new Date(d2));
    // console.log('hasTokenExpired: refreshToken...', new Date(d3));
    // accessToken
    if (d2 > d0) result = { ...result, accessTokenExpired: false };
    // refreshToken
    if (d3 > d0) result = { ...result, refreshTokenExpired: false };
  }

  return result;
};

/**
 * Function to perform an API test on the current token
 * @returns Boolean whether the API test was successful or not
 */
export const testToken = async () => {
  let result = false;
  const { tokenType, accessToken } = getLocalStorage('rsso').data;
  const { settingsId } = getLocalStorage('settings').data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST;
  const query = `'submitter'=$USER$`;
  const fields = 'requestId,theme,showApproval,showIncident,showChange,showProblem,showAsset,showPeople';
  const url = `/api/arsys/v1/entry/SBSA:PWA:UserSettings?q=(${query})&fields=values(${fields})`;

  await fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  }).then(response => {
    if (response.ok) {
      result = true;
      response.json().then(data => {
        if (data.entries.length > 0) {
          if (!settingsId) {
            saveSettings(data.entries[0].values);
          } else {
            if (settingsId !== data.entries[0].values.requestId) saveSettings(data.entries[0].values);
          }
        }
      }).catch(error => console.log(error));
    }
  }).catch(error => console.log(error));

  return result;
};

/**
  * Function to validate token
  * @param {boolean} runApiTest Should an API test be performed
  * @returns Boolean of true if token is valid
  */
export const validateToken = async (runApiTest) => {
  let result = false;
  const { tokenDate, accessToken } = getLocalStorage('rsso').data;

  if (tokenDate && accessToken) {
    const { accessTokenExpired, refreshTokenExpired } = hasTokenExpired();
    if (!accessTokenExpired) {
      if (runApiTest) {
        // console.log('validateToken: running API test...');
        if ((await testToken()).valueOf()) result = true;
      } else result = true;
    } else {
      if (!refreshTokenExpired && (await refreshToken()).valueOf()) result = true;
    }
  }

  return result;
};

/**
 * Internal helper function to save settings into storage
 * @param {any} data Seetings object to save
 */
function saveSettings(data) {
  saveLocalStorage(storageObjects.settings, {
    appVersion: defaultStorage.settings.appVersion,
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