import { getLocalSession } from '../utilities/localstorage';
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
 * @param {string} user Remedy login ID
 * @returns Promise of approvals
 */
export const getApprovals = (user) => {
  const session = getLocalSession().data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const query = `'Approvers' LIKE "%${user}%" AND (('Approval Status' = 0) OR ('Approval Status' = 3) OR ('Approval Status' = 4))`;
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
  const url = '/api/arsys/v1/entry/AP:Detail-Signature/?q=(' + query + ')&fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'GET',
    headers: { 'Authorization': 'AR-JWT ' + session.jwt },
    mode: 'cors',
  });
};

/**
 * POST Approval model
 */
 export const postApprovalModel = {
  requestId: '',
  status: '',
  shortDescription: '',
};

/**
 * Helper function to submit an approval
 * @returns Promise of new approval
 */
 export const postApproval = (data) => {
  const { jwt } = getLocalSession().data;
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + ':' + localEnvironment.ARPORT;
  const fields = 'requestId,status,shortDescription';
  const url = '/api/arsys/v1/entry/SBSA:PWA:Approval?fields=values(' + fields + ')';
  return fetch(host + url, {
    method: 'POST',
    headers: {
      'Authorization': 'AR-JWT ' + jwt,
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: data
  });
};