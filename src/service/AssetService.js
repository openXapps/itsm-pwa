import { getLocalStorage } from '../utilities/localstorage';
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
 * @returns Promise of assets
 */
export const getAssets = () => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const query = `'DatasetId' = "BMC.ASSET" AND 'Login Name' = $USER$`;
  // 240001003 = Manufacturer Name+
  const fields = 'AssetInstanceId,UserDisplayObjectName,Item,Model Number,240001003,Serial Number,Name,AssetLifecycleStatus';
  const url = '/api/arsys/v1/entry/AST:AssetJoinASTPeople/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
  // console.log('getAssets: response...', response);
  // return response;
};