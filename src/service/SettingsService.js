import { getLocalStorage } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

// https://docs.bmc.com/docs/ars1902/end-points-in-ar-rest-api-851893757.html
// https://docs.bmc.com/docs/ars2002/resources-for-the-rest-api-931133650.html

/**
 * Helper function to create user settings
 * @returns Promise of new entry
 */
export const postARSettings = (data) => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const fields = 'requestId,theme,showApproval,showIncident,showChange,showRequest,showAsset,showPeople';
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings?fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'POST',
    headers: {
      'Authorization': tokenType + ' ' + accessToken,
      'Content-Type': 'application/json',
      'X-Requested-By': 'XMLHttpRequest',
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
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/' + requestId;
  return fetch(host + url, {
    method: 'PUT',
    headers: {
      'Authorization': tokenType + ' ' + accessToken,
      'Content-Type': 'application/json',
      'X-Requested-By': 'XMLHttpRequest',
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
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'assignedTo' = $USER$`;
  const fields = 'requestId,theme,showApproval,showIncident,showChange,showRequest,showAsset,showPeople';
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors'
  });
};

/**
 * Helper function to trigger user setting actions
 * @param {string} action Action to trigger (SET_MODULE_FLAG, SET_MODULE_COUNT or SET_MODULE_FLAG_AND_COUNT)
 * @returns Promise of updated entry
 */
export const putARSettingsAction = (action) => {
  const { settingsId } = getLocalStorage('settings').data;
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/' + settingsId;

  if (!settingsId) return Promise.resolve({ ok: true });

  return fetch(host + url, {
    method: 'PUT',
    headers: {
      'Authorization': tokenType + ' ' + accessToken,
      'Content-Type': 'application/json',
      'X-Requested-By': 'XMLHttpRequest',
    },
    mode: 'cors',
    body: '{"values": {"zAction": "' + action + '"}}',
  });
};

/**
 * Module counters model - NOT USED for now
 */
export const moduleCountersModel = {
  approvals: 0,
  incidents: 0,
  changes: 0,
  requests: 0,
  assets: 0,
  people: 0,
};

/**
 * Helper function to fetch module counters from user settings form
 * @returns Promise of module counters
 */
export const getModuleCounters = () => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'assignedTo' = $USER$`;
  const fields = 'requestId,approvals,incidents,changes,requests,assets,people';
  const url = '/api/arsys/v1/entry/SBSA:PWA:UserSettings/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors'
  });
};

