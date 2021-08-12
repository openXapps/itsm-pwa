import { localEnvironment } from '../utilities/defaultdata';

/**
 * Helper function to get a JWT from Remedy
 * @param {string} code Azure code
 * @returns Fetch response object
 */
 export const getJWT = async (code) => {
  const host = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST;
  const url = '/rsso/oauth2/token';
  const redirect = encodeURIComponent(host + '/pwa');
  const secret = encodeURIComponent(localEnvironment.RSSOSECRET);
  const body = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect}&client_secret=${secret}&client_id=${localEnvironment.RSSOCLIENTID}`;
  console.log('POST...', host + url + '?' + body);
  const response = await fetch(host + loginURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'charset': 'UTF-8'
    },
    body: body
  });
  // The Response object offers a lot of useful methods (all returning promises)
  return response;
}