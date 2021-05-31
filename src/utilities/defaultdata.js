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
    theme: {
      isDark: false,
      template: 'light'
    },
  },
  // sb-itsm-session
  session: {
    user: '',
    pw: '',
    jwt: '',
    jwtDate: '',
  },
};

