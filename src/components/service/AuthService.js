import { saveLocalStorage, getSession } from '../../utilities/localstorage';
import { storageObjects } from '../../utilities/defaultdata';
import { utoa } from '../../utilities/base64';

const ARHOST = process.env.REACT_APP_ARHOST;
const ARPORT = process.env.REACT_APP_ARPORT;

export const getJWT = (username, password) => {
  let response = {
    statusOK: false,
    value: '',
  }
  const url = 'http://' + ARHOST + ':' + ARPORT + '/api/jwt/login';
  return Fetch(url, {
    method: 'POST',
    headers: {
      'authString': '',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    mode: 'cors',
    body: {
      username: username,
      password: password,
    }
  }).then(res => {
    return res.text();
  }).then((token) => {
    response = {
      statusOK: true,
      value: token
    }
    saveLocalStorage(storageObjects.session, {
      user: username,
      pw: utoa(password),
      jwt: token,
      jwtDate: new Date(),
    })
    return response;
  }).catch((err) => {
    response = {
      statusOK: false,
      value: 'Error fetching token from server',
    }
    return response;
  });
};

// TODO
export const validateJWT = () => {
  let response = false;
  if (getSession().statusOK) {
    if
  }
};