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
  notes: '',
  serviceCI: '',
  reason: '',
  impact: '',
  risk: '',
  scheduleStart: '',
  scheduleEnd: '',
};

/**
 * Helper function to fetch a change request
 * @param {string} changeId Change request number to search
 * @returns Promise of a change request
 */
export const getChangeRequest = (changeId) => {
  const { jwt } = getLocalSession().data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const fields = `
    Infrastructure Change ID,
    Change Request Status,
    ASCHG,
    Description,
    ServiceCI,
    Reason For Change,
    Impact,
    Risk Level,
    Detailed Description,
    Scheduled Start Date,
    Scheduled End Date
    `;
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

/**
 * Change work info model
 */
 export const changeWorkInfoModel = [{
  workLogType: '',
  detailedDescription: '',
  workLogSubmitter: '',
  workLogSubmitDate: '',
}];

/**
 * Helper function to fetch a change work info
 * @param {string} changeId Change request number to search
 * @returns Promise of a change work info
 */
 export const getChangeWorkInfo = (changeId) => {
  const { jwt } = getLocalSession().data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const fields = `
    Work Log Type,
    Detailed Description,
    Work Log Submitter,
    Work Log Submit Date
    `;
  const query = `'Infrastructure Change ID'="${changeId}"`;
  const url = '/api/arsys/v1/entry/CHG:WorkLog/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + jwt },
    mode: 'cors',
  });
  // console.log('getChangeWorkInfo: response...', response);
  // return response;
};

/**
 * Change impacted areas model
 */
 export const changeImpactedAreasModel = [{
  company: '',
}];

/**
 * Helper function to fetch a change impacted areas
 * @param {string} changeId Change request number to search
 * @returns Promise of a change impacted areas
 */
 export const getChangeImpactedAreas = (changeId) => {
  const { jwt } = getLocalSession().data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const fields = `
    Company
    `;
  const query = `'Infrastructure Change ID'="${changeId}"`;
  const url = '/api/arsys/v1/entry/CHG:Impacted Areas/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + jwt },
    mode: 'cors',
  });
  // console.log('getChangeImpactedAreas: response...', response);
  // return response;
};