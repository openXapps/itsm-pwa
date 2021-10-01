/**
 * Local storage object types
 */
export const storageObjects = {
  rsso: 'sb-itsm-rsso',
  settings: 'sb-itsm-settings',
};

/**
 * Default data for app local storage
 */
export const defaultStorage = {
  // sb-itsm-rsso
  rsso: {
    accessToken: '',
    tokenType: '',
    expiresIn: 0,
    tokenDate: '',
    refreshToken: '',
  },
  // sb-itsm-settings
  settings: {
    appVersion: '1.1',
    settingsId: '',
    theme: 'light',
    approvals: false,
    incidents: false,
    changes: false,
    requests: true,
    assets: true,
    people: false,
  }
};

/**
 * Helper object to return local environment variables
 * @returns Environment variables from .env.local
 */
export const localEnvironment = {
  ARHOST: process.env.REACT_APP_ARHOST,
  WEBHOST: process.env.REACT_APP_WEBHOST,
  WEBPATH: process.env.REACT_APP_WEBPATH,
  RSSOCLIENTID: process.env.REACT_APP_RSSO_CLIENT_ID,
  RSSOSECRET: process.env.REACT_APP_RSSO_SECRET,
};

/**
 * Modules to show on landing route
 */
export const modules = [
  { name: 'approvals', label: 'My Approvals', img: './img/itsm-apr-alpha.png', path: '/approval', count: 0 },
  { name: 'requests', label: 'My Requests', img: './img/itsm-req-alpha.png', path: '/request', count: 0 },
  { name: 'assets', label: 'My Assets', img: './img/itsm-ast-alpha.png', path: '/asset', count: 0 },
  { name: 'incidents', label: 'My Incidents', img: './img/itsm-inc-alpha.png', path: '/incident', count: 0 },
  { name: 'changes', label: 'My Changes', img: './img/itsm-chg-alpha.png', path: '/change', count: 0 },
  { name: 'people', label: 'My People', img: './img/itsm-ppl-alpha.png', path: '/people', count: 0 },
];