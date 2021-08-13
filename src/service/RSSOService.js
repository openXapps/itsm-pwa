import { getLocalRSSO } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

/**
 * Helper function to get a JWT from RSSO
 * @param {string} code Azure code
 * @returns Promised response of a new RSSO token request
 */
export const getJWT = (code) => {
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST;
  const url = '/rsso/oauth2/v1.1/token';
  const redirect = encodeURIComponent(host + '/pwa');
  const secret = encodeURIComponent(localEnvironment.RSSOSECRET);
  const body = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect}&client_secret=${secret}&client_id=${localEnvironment.RSSOCLIENTID}`;
  console.log('getJWT: POST...', host + url + '?' + body);
  return fetch(host + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'charset': 'UTF-8'
    },
    body: body
  });
}

/**
 * Helper function to revoke a JWT from RSSO
 * @returns Promised response of a RSSO token revoke
 */
export const revokeJWT = () => {
  const { accessToken } = getLocalRSSO().data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST;
  const url = '/rsso/oauth2/revoke';
  // const redirect = encodeURIComponent(host + '/pwa');
  const body = `token=${accessToken}&token_type_hint=access_token`;
  console.log('revokeJWT: POST...', host + url + '?' + body);
  return fetch(host + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + accessToken
    },
    body: body
  });
}

/**
 * Helper function to validate JWT against Remedy
 * @returns boolean whether JWT is still valid
 */
export const hasValidJWT = () => {
  let response = false;
  const rsso = getLocalRSSO();
  if (rsso.statusOK) {
    if (rsso.data.tokenDate && rsso.data.accessToken) {
      if (!hasJWTExpired(rsso.data.tokenDate, rsso.data.expiresIn)) {
        // if (testJWT(rsso.data.jwt)) response = true;
        response = true;
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
export const hasJWTExpired = (tokenDate, expiresIn) => {
  let response = true;
  console.log('hasJWTExpired: testing JWT date:expires...', tokenDate, expiresIn);
  if (tokenDate) {
    const d1 = new Date();
    const d2 = new Date(tokenDate);
    // Converting to minutes - threshold is 60 minutes
    console.log('hasJWTExpired: age...', ((d1.getTime() - d2.getTime()) / (expiresIn)));
    response = false;
  }
  // console.log('hasJWTExpired: response...', response);
  return response
};

/**
 * Helper function to test a JWT validity
 * @param {string} jwt Token to be used for testing connection
 * @returns A boolean to indicate whether the test was successful or not
 */
// export const testJWT = async (jwt, user) => {
//   const settings = getLocalSettings().data;
//   const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
//   const query = `'submitter'="${user}"`;
//   const fields = 'requestId,theme,showApproval,showIncident,showChange,showProblem,showAsset,showPeople';
//   // const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/' + (
//   //   settings.settingsId ? (settings.settingsId) : ('?q=(' + query + ')')
//   // ) + '&fields=values(' + fields + ')';
//   const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings?q=(' + query + ')&fields=values(' + fields + ')';
//   // console.log('testJWT: url...', url);

//   const response = await fetch(host + url, {
//     method: 'GET',
//     headers: { 'Authorization': 'AR-JWT ' + jwt },
//     mode: 'cors',
//   });
//   // response.json().then(data => { console.log('testJWT: response...', data) });

//   if (response.ok) {
//     response.json().then(data => {
//       if (data.entries.length > 0) {
//         if (!settings.settingsId) {
//           saveSettings(data.entries[0].values);
//         } else {
//           if (settings.settingsId !== data.entries[0].values.requestId) {
//             saveSettings(data.entries[0].values);
//           }
//         }
//       }
//     });
//   }
//   return response.ok;
// };

/**
 * Internal helper function to save settings into storage
 * @param {any} data Seetings object to save
 */
// function saveSettings(data) {
//   saveLocalStorage(storageObjects.settings, {
//     settingsId: data.requestId,
//     theme: data.theme,
//     approvals: data.showApproval === 'true' ? true : false,
//     incidents: data.showIncident === 'true' ? true : false,
//     changes: data.showChange === 'true' ? true : false,
//     problems: data.showProblem === 'true' ? true : false,
//     assets: data.showAsset === 'true' ? true : false,
//     people: data.showPeople === 'true' ? true : false,
//   });
// }