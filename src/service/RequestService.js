import { getLocalStorage } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

/**
 * Request model
 */
export const requestModel = {
  requestId: '',
  summary: '',
  firstName: '',
  lastName: '',
  submitDate: '',
  details: [],
};

/**
 * Helper function to fetch a request
 * @param {string} requestId Request number to search
 * @returns Promise of a request
 */
export const getRequest = (requestId) => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const fields = `
    Request Number,
    Summary,
    First Name,
    Last Name,
    Submit Date,
    SR Type Field 1
    `;
  const query = `'Request Number'="${requestId}"`;
  const url = '/api/arsys/v1/entry/SRM:Request/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
};

/**
 * Request list model
 */
export const requestListModel = {
  requestId: '',
  summary: '',
  submitDate: '',
  status: '',
};

/**
 * Helper function to fetch requests
 * @returns Promise a list of requests
 */
export const getRequestList = () => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'Requested By Login ID' = $USER$ AND 'Status' < "Cancelled"`;
  const fields = `Request Number,Summary,Submit Date,Status`;
  const url = '/api/arsys/v1/entry/SRM:Request/?q=(' + query + ')&fields=values(' + fields + ')';

  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
};

