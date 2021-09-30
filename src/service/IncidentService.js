import { getLocalStorage } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

/**
 * Incident list model
 */
export const incidentListModel = {
  incidentId: '',
  submitDate: '',
  description: '',
  firstName: '',
  lastName: '',
};

/**
 * Helper function to fetch incidents
 * @returns Promise a list of incidents
 */
export const getIncidentList = () => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'Status' < 4 AND 'Assignee Login ID' = $USER$`;
  const fields = 'Incident Number,Submit Date,Description,First Name,Last Name';
  const url = '/api/arsys/v1/entry/HPD:Help Desk/?q=(' + query + ')&fields=values(' + fields + ')';

  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
};

/**
 * Incident details model
 */
export const incidentModel = {
  incidentId: '',
  submitDate: '',
  description: '',
  notes: '',
  serviceCi: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

/**
 * Helper function to fetch an incident
 * @returns Promise an incident
 */
export const getIncident = (incId) => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'Incident Number' = "${incId}"`;
  const fields = 'Submit Date,Description,ServiceCI,First Name,Last Name,Phone Number,Customer Login ID,Detailed Decription';
  const url = '/api/arsys/v1/entry/HPD:Help Desk/?q=(' + query + ')&fields=values(' + fields + ')';

  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
};


