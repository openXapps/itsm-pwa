import { getLocalStorage } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

/**
 * Asset list model
 */
export const assetListModel = {
  reconId: '',
  class: '',
  classId: '',
  item: '',
  model: '',
  make: '',
  serial: '',
  name: '',
  status: '',
};

/**
 * Helper function to fetch assets
 * @returns Promise a list of assets
 */
export const getAssetList = () => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'DatasetId' = "BMC.ASSET" AND 'Login Name' = $USER$`;
  // 240001003 = Manufacturer Name+
  const fields = 'AssetInstanceId,UserDisplayObjectName,Item,Model Number,240001003,Serial Number,Name,AssetLifecycleStatus,Class Id';
  const url = '/api/arsys/v1/entry/AST:AssetJoinASTPeople/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
  // console.log('getAssets: response...', response);
  // return response;
};

/**
 * Asset custom fields model
 */
 export const customFieldsModel = {
  loginUser: '',
  loginDate: '',
  verifyUser: '',
  verifyDate: '',
};

/**
 * Helper function to fetch a Computer System asset
 * @returns Promise an asset
 */
export const getCustomFields = (reconId) => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'Reconciliation ID' = "${reconId}"`;
  const fields = 'Last Logged on User,Last Logged on Date,Last Verified By,Last Verified Date';
  const url = '/api/arsys/v1/entry/SBSA:AST:CustomFields/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
  // console.log('getAssets: response...', response);
  // return response;
};

/**
 * Asset details model
 */
export const computerSystemModel = {
  name: '',
  serial: '',
  tag: '',
  class: '',
  item: '',
  model: '',
  make: '',
  status: '',
  scanDate: '',
  costCenter: '',
  hostName: '',
  domainName: '',
};

/**
 * Helper function to fetch a Computer System asset
 * @returns Promise an asset
 */
export const getComputerSystem = (reconId) => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARHOST;
  const query = `'Data Set Id' = "BMC.ASSET" AND 'Reconciliation Identity' = "${reconId}"`;
  // 240001003 = Manufacturer Name+
  const fields = 'Name,Serial Number,Tag Number,AssetLifecycleStatus,Item,Model Number,240001003,LastScanDate,Cost Center,UserDisplayObjectName,DNS Host Name,Domain';
  const url = '/api/arsys/v1/entry/AST:ComputerSystem/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
  // console.log('getAssets: response...', response);
  // return response;
};



