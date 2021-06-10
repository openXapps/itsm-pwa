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
* Write initial storage on first time usage
 */
export const initialUse = () => {
  const session = getLocalSession();
  const settings = getLocalSettings();

  // No session exist
  if (!session.statusOK) {
    saveLocalStorage(storageObjects.session, defaultStorage.session);
  }

  // No settings exist
  if (!settings.statusOK) {
    saveLocalStorage(storageObjects.settings, defaultStorage.settings);
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
 * Get SESSION from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getLocalSession = () => {
  let response = {
    statusOK: false,
    data: defaultStorage.session,
  };
  try {
    const session = JSON.parse(localStorage.getItem(storageObjects.session));
    if (session) {
      response = {
        statusOK: true,
        data: session
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

/**
 * Get SETTINGS from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getLocalSettings = () => {
  let response = {
    statusOK: false,
    data: defaultStorage.settings,
  };
  try {
    const settings = JSON.parse(localStorage.getItem(storageObjects.settings));
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

