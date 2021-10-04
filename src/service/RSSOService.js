import { saveLocalStorage, getLocalStorage } from '../utilities/localstorage';
import { localEnvironment, storageObjects, defaultStorage } from '../utilities/defaultdata';
import { postARSettings } from './SettingsService';

// https://docs.bmc.com/docs/ars2002/enabling-oauth-authorization-for-remedy-ar-system-rest-apis-909638148.html#EnablingOAuthauthorizationforRemedyARSystemRESTAPIs-TouseRemedySSOOAuth2.0authorizationinyourapplication

/**
* Function to get a token with OAuth code flow
* @param {string} code OAuth code
* @returns Promise of fetch status and tokan value
*/
export const getTokenWithCode = async (code) => {
  let result = { ok: false, token: '' };
  const url = localEnvironment.ARHOST + '/rsso/oauth2/v1.1/token';
  const redirect = encodeURIComponent(localEnvironment.WEBHOST + localEnvironment.WEBPATH);
  const secret = encodeURIComponent(localEnvironment.RSSOSECRET);
  const body = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect}&client_secret=${secret}&client_id=${localEnvironment.RSSOCLIENTID}`;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  }).then(response => {
    if (!response.ok) throw new Error('ERR: ' + response.status + ' ' + response.statusText);
    return response.json();
  }).then(data => {
    result = { ok: true, token: data.access_token };
    saveLocalStorage(storageObjects.rsso, {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      tokenDate: new Date(),
      refreshToken: data.refresh_token,
    });
    // else saveLocalStorage(storageObjects.rsso, defaultStorage.rsso);
  }).catch(error => console.log('getTokenWithCode: error...', error));

  return result;
}

/**
* Function to refresh the current token
* If the refresh is successful then update local session cache
* @returns Promise of fetch status and token value
*/
export const refreshToken = async () => {
  let result = { ok: false, token: '' };
  const { refreshToken } = getLocalStorage('rsso').data;
  const url = localEnvironment.ARHOST + '/rsso/oauth2/v1.1/token';
  const secret = encodeURIComponent(localEnvironment.RSSOSECRET);
  const body = `grant_type=refresh_token&refresh_token=${refreshToken}&client_secret=${secret}&client_id=${localEnvironment.RSSOCLIENTID}`;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body,
  }).then(response => {
    if (!response.ok) throw new Error('ERR: ' + response.status + ' ' + response.statusText);
    return response.json();
  }).then(data => {
    result = { ok: true, token: data.access_token };
    saveLocalStorage(storageObjects.rsso, {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      tokenDate: new Date(),
      refreshToken: data.refresh_token,
    });
  }).catch(error => console.log('refreshToken: error...', error));

  return result;
};

/**
 * Function to revoke a token from RSSO
 * @param {string} hint What token to revoke (access_token or refresh_token)
 * @returns Promise of fetch Response
 */
export const revokeToken = (hint) => {
  const { accessToken, refreshToken } = getLocalStorage('rsso').data;
  const token = hint === 'access_token' ? accessToken : refreshToken;
  const url = localEnvironment.ARHOST + '/rsso/oauth2/revoke';
  const secret = encodeURIComponent(localEnvironment.RSSOSECRET);
  const body = `token=${token}&token_type_hint=${hint}&client_secret=${secret}&client_id=${localEnvironment.RSSOCLIENTID}`;

  return fetch(url, {
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
  const refreshTokenValidFor = 3000; // 50 minutes
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
 * @returns Promise of Boolean whether the API test was successful or not
 */
export const testToken = async (token) => {
  let result = false;
  const { tokenType, accessToken } = getLocalStorage('rsso').data;
  const query = `'assignedTo'=$USER$`;
  const fields = 'requestId,theme,showApproval,showIncident,showChange,showRequest,showAsset,showPeople';
  const url = `${localEnvironment.ARHOST}/api/arsys/v1/entry/SBSA:PWA:UserSettings?q=(${query})&fields=values(${fields})`;

  await fetch(url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + token || accessToken },
    mode: 'cors',
  }).then(response => {
    if (!response.ok) throw new Error('ERR: ' + response.status + ' ' + response.statusText);
    return response.json();
  }).then(data => {
    result = true;
    if (data.entries.length > 0) saveSettings(data.entries[0].values);
    if (data.entries.length === 0) {
      postARSettings('{"values": {"zAction": "SET_MODULE_COUNT_AND_FLAG"}}').then(response => {
        if (response.status !== 201) throw new Error('ERR: ' + response.status + ' ' + response.statusText);
        return response.json();
      }).then(data => {
        saveSettings(data.values);
      }).catch(error => console.log('postARSettings: error...', error.message));
    }
  }).catch(error => console.log('testToken: error...', error.message));

  return result;
};

/**
  * Function to validate token
  * @param {boolean} runApiTest Should an API test be performed
  * @returns Promise of Boolean whether token is still valid
  */
export const validateToken = async (runApiTest) => {
  let result = false;
  const { tokenDate, accessToken } = getLocalStorage('rsso').data;

  if (tokenDate && accessToken) {
    const { accessTokenExpired, refreshTokenExpired } = hasTokenExpired();
    if (!accessTokenExpired) {
      result = true;
      if (runApiTest) await testToken();
    }
    if (!refreshTokenExpired && !result) {
      const refresh = await refreshToken();
      result = refresh.ok;
      if (result && runApiTest) await testToken(refresh.token);
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
    requests: data.showRequest === 'true' ? true : false,
    assets: data.showAsset === 'true' ? true : false,
    people: data.showPeople === 'true' ? true : false,
  });
}