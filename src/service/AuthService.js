import { saveLocalStorage, getSession } from '../utilities/localstorage';
import { storageObjects, localEnvironment, defaultStorage } from '../utilities/defaultdata';
// import { utoa } from '../utilities/base64';

/**
 * Helper function to get a JWT from Remedy
 * @param {string} url Remedy URL to call
 * @param {string} username Remedy user login name
 * @param {string} password Remedy user login password
 * @returns Return a Promise
 */
export const getJWT = (username, password) => {
  const host = 'http://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const loginURL = '/api/jwt/login';
  return fetch(host + loginURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    mode: 'cors',
    body: `username=${username}&password=${password}&authString=`
  });
}

/**
 * Helper function to release a Remedy JWT
 * @param {string} url Remedy URL to call
 * @param {string} token Token to release
 */
export const releaseJWT = (token) => {
  const host = 'http://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const logoutURL = '/api/jwt/logout';
  const session = getSession().data;
  fetch(host + logoutURL, {
    method: 'POST',
    headers: {
      'Authorization': 'AR-JWT ' + token,
    },
    mode: 'cors',
  }).then((response) => {
    // console.log('releaseJWT: response...', response);
    saveLocalStorage(storageObjects.session, { ...session, jwt: '', jwtDate: '' });
  });
};

export const logout = (token) => {
  releaseJWT(token);
  saveLocalStorage(storageObjects.session, defaultStorage);
};

/**
 * Helper function to validate JWT against Remedy
 * @param {string} Token to test
 * @returns boolean whether JWT is still valid
 */
export const hasValidJWT = () => {
  let response = false;
  const session = getSession();
  if (session.statusOK) {
    if (session.data.jwtDate && session.data.jwt) {
      if (!hasJWTExpired()) {
        response = true;
      }
    }
  }
  return response;
};

// /**
//  * Helper function to validate whether JWT has expired
//  * JWT and issue date gets pulled from Local Storage
//  * @returns boolean whether JWT expired or not
//  */
export const hasJWTExpired = () => {
  let response = true;
  let jwtAge = 0;
  const session = getSession();
  if (session.statusOK) {
    if (session.data.jwtDate && session.data.jwt) {
      const d1 = new Date();
      const d2 = new Date(session.data.jwtDate);
      // Converting to minutes - threshold is 60 minutes
      jwtAge = ((d1.getTime() - d2.getTime()) / (1000 * 60));
      // console.log('hasJWTExpired: d1.......', d1);
      // console.log('hasJWTExpired: d2.......', d2);
      // console.log('hasJWTExpired: jwtAge...', jwtAge, d1.getTime(), d2.getTime());
      if (jwtAge < 60) response = false;
    }
  }
  return response
};

/**
 * Helper function to test a JWT validity
 * @param {string} jwt Token to be used for testing connection
 * @returns A Promise to indicate whether the test was successful or not
 */
export const testJWT = (jwt) => {
  const host = 'http://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const url = host + '/api/arsys/v1.0/entry/COM:Company/CPY000000000015?fields=values(Company Entry ID)';
  return fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'AR-JWT ' + jwt,
    },
    mode: 'cors',
  });
};
