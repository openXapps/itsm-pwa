import { settingsModel } from '../service/DataService';

/**
 * Application meta data
 */
export const application = {
  version: '0.1.0',
};

/**
 * Local storage object types
 */
export const storageObjects = {
  session: 'sb-itsm-session',
  settings: 'sb-itsm-settings',
};

/**
 * Default data for app local storage
 */
export const defaultStorage = {
  // sb-itsm-session
  session: {
    user: '',
    jwt: '',
    jwtDate: '',
  },
  // sb-itsm-settings
  settings: settingsModel,
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
  { name: 'approvals', label: 'My Approvals', img: './img/itsm-apr-alpha.png', path: '/approval' },
  { name: 'incidents', label: 'My Incidents', img: './img/itsm-inc-alpha.png', path: '/incident' },
  { name: 'changes', label: 'My Changes', img: './img/itsm-chg-alpha.png', path: '/change' },
  { name: 'problems', label: 'My Investigations', img: './img/itsm-pbm-alpha.png', path: '/problem' },
  { name: 'assets', label: 'My Assets', img: './img/itsm-ast-alpha.png', path: '/asset' },
  { name: 'people', label: 'My People', img: './img/itsm-ppl-alpha.png', path: '/people' },
];