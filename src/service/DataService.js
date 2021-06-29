import { getLocalSession } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

// https://docs.bmc.com/docs/ars1902/end-points-in-ar-rest-api-851893757.html
// https://docs.bmc.com/docs/ars2002/resources-for-the-rest-api-931133650.html

/**
 * Default settings model
 */
export const settingsModel = {
  settingsId: '',
  theme: 'light',
  // theme: 'dark',
  // theme: 'concrete',
  // theme: 'monday',
  approvals: true,
  incidents: false,
  changes: false,
  problems: false,
  assets: true,
  people: false,
}

/**
 * Helper function to create user settings
 * @returns Promise of new entry
 */
export const postARSettings = (data) => {
  const session = getLocalSession().data;
  const host = 'https://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const fields = 'requestId';
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings?fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'POST',
    headers: {
      'Authorization': 'AR-JWT ' + session.jwt,
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: data
  });
};

/**
 * Helper function to update user settings
 * @param {string} requestId Request ID to update
 * @returns Promise of updated entry
 */
export const putARSettings = (requestId, data) => {
  const session = getLocalSession().data;
  const host = 'https://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/' + requestId;
  return fetch(host + url, {
    method: 'PUT',
    headers: {
      'Authorization': 'AR-JWT ' + session.jwt,
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: data
  });
};

/**
 * Helper function to fetch user settings
 * @returns Promise of existing entry
 */
export const getARSettings = () => {
  const { user, jwt } = getLocalSession().data;
  const host = 'https://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const query = `'submitter'="${user}"`;
  const fields = 'requestId,theme,showApproval,showIncident,showChange,showProblem,showAsset,showPeople';
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + jwt },
    mode: 'cors'
  });
};


