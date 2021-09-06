import { storageObjects, defaultStorage } from './defaultdata';

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
 * Write local storage object
 * @param {string} item Local storage item to write
 * @param {any} data Local storage object to write
 */
export const saveLocalStorage = (item, data) => {
  try {
    localStorage.setItem(item, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get local storage object
 * @param {string} item Local storage item to get
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getLocalStorage = (item) => {
  let result = {
    statusOK: false,
    data: defaultStorage[item],
  };
  try {
    const response = JSON.parse(localStorage.getItem(storageObjects[item]));
    if (response) {
      result = {
        statusOK: true,
        data: response
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (err) {
    // Life goes on ...
    // console.log(err);
  }
  return result;
};

/**
* Write initial storage on first time usage
 */
export const initialUse = () => {
  const rsso = getLocalStorage('rsso');
  const settings = getLocalStorage('settings');

  // v1.1 changes
  if (settings.statusOK && !settings.data.appVersion) {
    saveLocalStorage(storageObjects.settings, {
      ...settings.data,
      appVersion: defaultStorage.settings.appVersion,
    });
  }

  // No RSSO exist
  if (!rsso.statusOK) saveLocalStorage(storageObjects.rsso, defaultStorage.rsso);

  // No settings exist
  if (!settings.statusOK) saveLocalStorage(storageObjects.settings, defaultStorage.settings);
};

