import { getLocalStorage } from '../utilities/localstorage';
import { localEnvironment } from '../utilities/defaultdata';

/**
 * Approval model
 */
export const approvalModel = {
  avatar: '',
  requester: '',
  application: '',
  signatureId: '',
  sourceNumber: '',   // 14516
  description: '',    // 14506
  createDate: '',
};

/**
 * Helper function to fetch approvals
 * @returns Promise of approvals
 */
export const getApprovals = () => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST;
  const query = `('Approvers' LIKE $USER$) AND (('Approval Status' = 0) OR ('Approval Status' = 3) OR ('Approval Status' = 4))`;
  // const query = `('Approval Status' = 0 OR 'Approval Status' = 3 OR 'Approval Status' = 4)`;
  // const query = `'Signature ID' = "000000000002059"`;
  const fields = `
    Requester,
    Application,
    Signature ID,
    14506,
    14516,
    Create-Date-Sig
    `;
  const url = `/api/arsys/v1/entry/AP:Detail-Signature/?q=(${query})&fields=values(${fields})`;
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': tokenType + ' ' + accessToken },
    mode: 'cors',
  });
};

/**
 * Helper function to submit an approval
 * @returns Promise of new approval
 */
export const postApproval = (data) => {
  const { accessToken, tokenType } = getLocalStorage('rsso').data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST;
  const fields = 'requestId,status,shortDescription';
  const url = `/api/arsys/v1/entry/SBSA:PWA:Approval?fields=values(${fields})`;
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