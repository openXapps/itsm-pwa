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
  approvals: true,
  incidents: true,
  changes: true,
  problems: true,
  assets: true,
  people: true,
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
  const session = getLocalSession().data;
  const host = 'https://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const query = `'submitter' = "${session.user}"`;
  const fields = 'requestId,theme,showApproval,showIncident,showChange,showProblem,showAsset,showPeople';
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + session.jwt },
    mode: 'cors'
  });
};

/**
 * Approval model
 */
export const approvalModel = {
  avatar: '',
  requester: '',
  application: '',
  signatureId: '',
  sourceNumber: '',   // 14516
  description: '',    // 14506
  createDate: '',
};

/**
 * Helper function to fetch approvals
 * @param {string} user Remedy login ID
 * @returns Promise of approvals
 */
export const getApprovals = (user) => {
  const session = getLocalSession().data;
  const host = 'https://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  // const query = encodeURI(`(";" + 'Approvers' + ";" LIKE "%;${user};%") AND (('Approval Status' = 0) OR ('Approval Status' = 3) OR ('Approval Status' = 4))`);
  const query = `'Approvers' LIKE "%${user}%" AND (('Approval Status' = 0) OR ('Approval Status' = 3) OR ('Approval Status' = 4))`;
  // console.log('getApprovals: query...', query);
  // const query = `('Approval Status' = 0 OR 'Approval Status' = 3 OR 'Approval Status' = 4)`;
  // const query = `'Signature ID' = "000000000002059"`;
  const fields = 'Requester,Application,Signature ID,14506,14516,Create-Date-Sig';
  const url = '/api/arsys/v1/entry/AP:Detail-Signature/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + session.jwt },
    mode: 'cors',
  });
  // console.log('getApprovals: response...', response);
  // return response;
};
