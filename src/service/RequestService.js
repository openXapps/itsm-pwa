import { getLocalSession } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

/**
 * Service request model
 */
export const serviceRequestModel = {
  requestId: '',
  summary: '',
  details: [],
};

/**
 * Helper function to fetch a service request
 * @param {string} requestId Service request number to search
 * @returns Promise of a service request
 */
export const getServiceRequest = (requestId) => {
  const { jwt } = getLocalSession().data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const fields = `
    Request Number,
    Summary,
    SR Type Field 1
    `;
  const query = `'Request Number'="${requestId}"`;
  const url = '/api/arsys/v1/entry/SRM:Request/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + jwt },
    mode: 'cors',
  });
};