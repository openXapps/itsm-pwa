// Utility module to manage HTML5 localStorage

import { storageObject, getDefaultData } from './defaultdata';

/**
 * Check whether localStorage is available.
 * It sets a dummy key.
 * Validates the dummy key.
 * Then deletes the dummy key.
 * @returns boolean
 */
export const isLocalStorage = () => {
  try {
    localStorage.setItem('test', 'x');
    // console.log(localStorage.getItem('text'));
    if (localStorage.getItem('test') === 'x') {
      localStorage.removeItem('test');
      return true;
    } else {
      throw new Error('localStorage unavailable');
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
* Write initial storage on first time usage
 */
export const initialUse = () => {
  const settings = getSettings();

  // Bump version if it exists and is not the latest
  if (settings.data.version && settings.data.version !== getDefaultData().settings.version) {
    saveLocalStorage(storageObject.setting, { ...settings.data, version: getDefaultData().settings.version });
  }

  // No settings exist
  if (!settings.statusOK) {
    saveLocalStorage(storageObject.settings, getDefaultData().settings);
  }

};

/**
 * Overwrite item to local storage
 * @param {string} obj Local storage identifier
 * @param {any} data Data object to store
 */
export const saveLocalStorage = (obj, data) => {
  try {
    localStorage.setItem(obj, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get SETTINGS from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
 export const getSettings = () => {
  let response = {
    statusOK: false,
    data: getDefaultData().settings,
  };
  try {
    const settings = JSON.parse(localStorage.getItem(storageObject.setting));
    if (settings) {
      response = {
        statusOK: true,
        data: settings
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (err) {
    // Life goes on ...
    // console.log(err);
  }
  return response;
};
