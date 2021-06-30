import { getLocalSession } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

/**
 * Change request model
 */
export const changeRequestModel = {
  changeId: '',
  status: '',
  coordinator: '',
  description: '',
  serviceCI: '',
  impact: '',
  risk: '',
};

/**
 * Helper function to fetch a change request
 * @param {string} changeId Change request number to search
 * @returns Promise of a change equest
 */
export const getChangeRequest = (changeId) => {
  const { jwt } = getLocalSession().data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const fields = 'Infrastructure Change ID,Change Request Status,ASCHG,Description,ServiceCI,Impact,Risk Level';
  const query = `'Infrastructure Change ID'="${changeId}"`;
  const url = '/api/arsys/v1/entry/CHG:Infrastructure Change/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + jwt },
    mode: 'cors',
  });
  // console.log('getChangeRequest: response...', response);
  // return response;
};