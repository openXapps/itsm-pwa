import { getLocalStorage } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

/**
 * People list model
 */
export const peopleListModel = {
  personId: '',
  firstName: '',
  lastName: '',
  jobTitle: '',
  supportStaff: '',
};

/**
 * Helper function to fetch people
 * @returns Promise a list of people
 */
export const getPeopleList = () => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'ManagerLoginID' = $USER$ AND 'Profile Status' = "Enabled"`;
  const fields = 'Person ID,First Name,Last Name,JobTitle,Support Staff';
  const url = '/api/arsys/v1/entry/CTM:People/?q=(' + query + ')&fields=values(' + fields + ')';

  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
};

/**
 * People profile model
 */
export const peopleProfileModel = {
  firstName: '',
  lastName: '',
  email: '',
  corporateId: '',
  jobTitle: '',
  phoneNumber: '',
  supportStaff: '',
};

/**
 * Helper function to fetch a people profile
 * @returns Promise a people profile
 */
export const getPeopleProfile = (personId) => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'Person ID' = "${personId}"`;
  const fields = 'First Name,Last Name,Remedy Login ID,Corporate ID,JobTitle,Phone Number Business,Support Staff';
  const url = '/api/arsys/v1/entry/CTM:People/?q=(' + query + ')&fields=values(' + fields + ')';

  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
};

/**
 * People permissions model
 */
export const peoplePermissionsModel = {
  xxx: '',
};

/**
 * Helper function to fetch a people permissions
 * @returns Promise a people permission
 */
export const getPeoplePermissions = (personId) => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'xxxx' = "${personId}"`;
  // 240001003 = Manufacturer Name+
  const fields = ',,,,,';
  const url = '/api/arsys/v1/entry/CTM:xxxx/?q=(' + query + ')&fields=values(' + fields + ')';

  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
};



