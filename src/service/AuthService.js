import { saveLocalStorage, getLocalSession, getLocalSettings } from '../utilities/localstorage';
import { storageObjects, localEnvironment, defaultStorage } from '../utilities/defaultdata';
// import { utoa } from '../utilities/base64';

// Read this post: https://dmitripavlutin.com/javascript-fetch-async-await/

/**
 * Helper function to get a JWT from Remedy
 * @param {string} url Remedy URL to call
 * @param {string} username Remedy user login name
 * @param {string} password Remedy user login password
 * @returns Return a Promise
 */
export const getJWT = async (username, password) => {
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const loginURL = '/api/jwt/login';
  const response = await fetch(host + loginURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    mode: 'cors',
    body: `username=${username}&password=${password}&authString=`
  });
  // The Response object offers a lot of useful methods (all returning promises)
  return response;
}

/**
 * Helper function to release a Remedy JWT
 * @param {boolean} flushUser Should we clear user creds in local storage
 * @param {string} token Token to be release
 */
export const logout = async (flushUser, token) => {
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const logoutURL = '/api/jwt/logout';
  const session = getLocalSession().data;
  const response = await fetch(host + logoutURL, {
    method: 'POST',
    headers: { 'Authorization': 'AR-JWT ' + token },
    mode: 'cors',
  });
  // console.log('releaseJWT: response...', response);
  if (response.ok) {
    if (flushUser) {
      saveLocalStorage(storageObjects.session, defaultStorage.session);
    } else {
      saveLocalStorage(storageObjects.session, { ...session, jwt: '', jwtDate: '' });
    }
  }
};

/**
 * Helper function to validate JWT against Remedy
 * @param {string} Token to test
 * @returns boolean whether JWT is still valid
 */
export const hasValidJWT = () => {
  let response = false;
  const session = getLocalSession();
  if (session.statusOK) {
    if (session.data.jwtDate && session.data.jwt) {
      if (!hasJWTExpired(session.data.jwtDate)) {
        if (testJWT(session.data.jwt, session.data.user)) response = true;
      }
    }
  }
  return response;
};

/**
 * Helper function to validate whether JWT has expired
 * @param {string} jwtDate Last token request date
 * @returns boolean whether JWT expired or not
 */
export const hasJWTExpired = (jwtDate) => {
  let response = true;
  let jwtAge = 0;
  // console.log('hasJWTExpired: testing JWT date...', jwtDate);
  if (jwtDate) {
    const d1 = new Date();
    const d2 = new Date(jwtDate);
    // Converting to minutes - threshold is 60 minutes
    jwtAge = ((d1.getTime() - d2.getTime()) / (1000 * 60));
    if (jwtAge < 60) response = false;
  }
  // console.log('hasJWTExpired: response...', response);
  return response
};

/**
 * Helper function to test a JWT validity
 * @param {string} jwt Token to be used for testing connection
 * @returns A boolean to indicate whether the test was successful or not
 */
export const testJWT = async (jwt, user) => {
  const settings = getLocalSettings().data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const query = `'submitter'="${user}"`;
  const fields = 'requestId,theme,showApproval,showIncident,showChange,showProblem,showAsset,showPeople';
  // const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/' + (
  //   settings.settingsId ? (settings.settingsId) : ('?q=(' + query + ')')
  // ) + '&fields=values(' + fields + ')';
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings?q=(' + query + ')&fields=values(' + fields + ')';
  // console.log('testJWT: url...', url);

  const response = await fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + jwt },
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