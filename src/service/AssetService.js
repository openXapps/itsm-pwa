import { getLocalSession } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

/**
 * Asset model
 */
export const assetModel = {
  reconId: '',
  class: '',
  item: '',
  model: '',
  make: '',
  serial: '',
  name: '',
  status: '',
};

/**
 * Helper function to fetch assets
 * @param {string} user Remedy login ID
 * @returns Promise of assets
 */
export const getAssets = (user) => {
  const session = getLocalSession().data;
  const host = 'https://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  // const query = encodeURI(`(";" + 'Approvers' + ";" LIKE "%;${user};%") AND (('Asset Status' = 0) OR ('Asset Status' = 3) OR ('Asset Status' = 4))`);
  const query = `'DatasetId' = "BMC.ASSET" AND 'Login Name' = "${user}"`;
  // 240001003 = Manufacturer Name+
  const fields = 'AssetInstanceId,UserDisplayObjectName,Item,Model Number,240001003,Serial Number,Name,AssetLifecycleStatus';
  const url = '/api/arsys/v1/entry/AST:AssetJoinASTPeople/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + session.jwt },
    mode: 'cors',
  });
  // console.log('getAssets: response...', response);
  // return response;
};