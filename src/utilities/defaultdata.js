/**
 * Local storage object types
 */
export const storageObjects = {
  settings: 'sb-itsm-settings',
  session: 'sb-itsm-session',
};

/**
 * Default data for app local storage
 */
export const defaultStorage = {
  // sb-itsm-settings
  settings: {
    version: '0.1.0',
    // theme: 'dark',
    theme: 'light',
  },
  // sb-itsm-session
  session: {
    user: '',
    jwt: '',
    jwtDate: '',
  },
};

/**
 * Helper object to return local environment variables
 * @returns Environment variables from .env.local
 */
export const localEnvironment = {
  ARHOST: process.env.REACT_APP_ARHOST,
  ARPORT: process.env.REACT_APP_ARPORT,
};

/**
 * Modules to show on landing route
 */
export const modules = [
  { name: 'My Approvals', img: './img/itsm-apr.png', path: '/approvals', hide: false },
  { name: 'My Incidents', img: './img/itsm-inc.jpg', path: '/incidents', hide: false },
  { name: 'My Changes', img: './img/itsm-chg.png', path: '/changes', hide: false },
  { name: 'My Investigations', img: './img/itsm-pbm.jpg', path: '/problems', hide: false },
  { name: 'My Assets', img: './img/itsm-ast.jpg', path: '/assets', hide: false },
  { name: 'My People', img: './img/itsm-ppl.jpg', path: '/people', hide: false },
];