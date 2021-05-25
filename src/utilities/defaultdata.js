/**
 * Local storage object types
 */
export const storageObject = {
  settings: 'sb-itsm-settings',
};

/**
 * Default data for app local storage
 */
export const getDefaultData = () => {
  const response = {
    // sb-itsm-settings
    settings: {
      version: '0.1.0',
      theme: {
        isDark: false,
        template: 'light'
      },
    },
  };
  return response;
};

