/**
 * Application meta data
 */
export const application = {
  version: '1.0',
};

/**
 * Local storage object types
 */
export const storageObjects = {
  session: 'sb-itsm-session',
  settings: 'sb-itsm-settings',
  rsso: 'sb-itsm-rsso',
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
  // sb-itsm-session
  session: {
    user: '',
    jwt: '',
    jwtDate: '',
  },
  // sb-itsm-settings
  settings: {
    settingsId: '',
    theme: 'light',
    // theme: 'dark',
    // theme: 'concrete',
    // theme: 'monday',
    approvals: true,
    incidents: false,
    changes: false,
    problems: false,
    assets: true,
    people: false,
  }
};

/**
 * Helper object to return local environment variables
 * @returns Environment variables from .env.local
 */
export const localEnvironment = {
  ARPROTOCOL: process.env.REACT_APP_ARPROTOCOL,
  ARHOST: process.env.REACT_APP_ARHOST,
  ARPORT: process.env.REACT_APP_ARPORT,
  RSSOCLIENTID: process.env.REACT_APP_RSSO_CLIENT_ID,
  RSSOSECRET: process.env.REACT_APP_RSSO_SECRET,
};

/**
 * Modules to show on landing route
 */
export const modules = [
  { name: 'approvals', label: 'My Approvals', img: './img/itsm-apr-alpha.png', path: '/approval' },
  { name: 'incidents', label: 'My Incidents', img: './img/itsm-inc-alpha.png', path: '/incident' },
  { name: 'changes', label: 'My Changes', img: './img/itsm-chg-alpha.png', path: '/change' },
  { name: 'problems', label: 'My Investigations', img: './img/itsm-pbm-alpha.png', path: '/problem' },
  { name: 'assets', label: 'My Assets', img: './img/itsm-ast-alpha.png', path: '/asset' },
  { name: 'people', label: 'My People', img: './img/itsm-ppl-alpha.png', path: '/people' },
];