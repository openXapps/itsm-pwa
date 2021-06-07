import { getLocalSession } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

// https://docs.bmc.com/docs/ars1902/end-points-in-ar-rest-api-851893757.html
// https://docs.bmc.com/docs/ars2002/resources-for-the-rest-api-931133650.html

/**
 * Settings model
 */
export const settingsModel = {
  requestId: '',
  instanceId: '',
  theme: 'light',
  showApprovals: true,
  showIncidents: true,
};

/**
 * Helper function to fetch user settings
 * @param {string} user Request ID of settings entry
 * @returns Promise of settings
 */
export const getARSettings = (user) => {
  const session = getLocalSession().data;
  const host = 'https://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const query = `'submitter' = "${user}"`;
  const fields = 'requestId,instanceId,theme,showApprovals,showIncidents';
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + session.jwt },
    mode: 'cors',
  });
  // console.log('getARSettings: response...', response);
  // return response;
};

export const putARSettings = (requestId) => {
  const session = getLocalSession().data;
  const host = 'https://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const fields = 'requestId,instanceId,theme,showApprovals,showIncidents';
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/?q=()&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + session.jwt },
    mode: 'cors',
  });
  // console.log('putARSettings: response...', response);
  // return response;
};

/**
 * Approvals model
 */
export const approvalsModel = {
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
