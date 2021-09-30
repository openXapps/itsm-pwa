export const themeList = [
  { themeId: 'light', themeAlias: 'Sunny Day' },
  { themeId: 'dark', themeAlias: 'Darth Vader' },
  { themeId: 'concrete', themeAlias: 'Concrete Jungle' },
  { themeId: 'monday', themeAlias: 'Monday Blues' },
  { themeId: 'ocean', themeAlias: 'Ocean Breeze' },
];

// https://uigradients.com

export const themes =
{
  dark: {
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            // background: 'linear-gradient(to right, #141e30, #243b55) no-repeat fixed', // Royal
            // background: 'linear-gradient(to right, #485563, #29323c) no-repeat fixed', // ServQuick
            background: 'linear-gradient(145deg, #000000, #434343) no-repeat fixed', // Deep Space
          },
        },
      },
      MuiAccordionDetails: {
        root: {
          padding: 0,
        }
      },
    },
    palette: {
      type: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#fb8c00',
      },
      background: {
        default: '#303030',
        paper: '#404040',
      },
    },
  },
  light: {
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            background: 'linear-gradient(145deg, #ffd89b, #6492b1) no-repeat fixed', // Jupiter
          },
        },
      },
      MuiAccordionDetails: {
        root: {
          padding: 0,
        }
      },
    },
    palette: {
      type: 'light',
    },
  },
  concrete: {
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            // background: 'linear-gradient(to right, #4b79a1, #283e51) no-repeat fixed', // Dark Skies
            background: 'linear-gradient(145deg, #ffffff, #656179) no-repeat fixed', // Steel Gray
          },
        },
      },
      MuiAccordionDetails: {
        root: {
          padding: 0,
        }
      },
    },
    palette: {
      type: 'light',
      primary: {
        main: '#5c6bc0',
      },
      secondary: {
        main: '#f44336',
      },
      background: {
        default: '#c3c7c9',
        paper: '#dde9f0',
      },
    },
  },
  monday: {
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            // background: 'linear-gradient(to right, #1e3c72, #2a5298) no-repeat fixed', // Joomla
            background: 'linear-gradient(145deg, #7ab9e2, #748ba2) no-repeat fixed', // Nighthawk
          },
        },
      },
      MuiAccordionDetails: {
        root: {
          padding: 0,
        }
      },
    },
    palette: {
      type: 'light',
      primary: {
        main: '#1a2439',
      },
      secondary: {
        main: '#607d8b',
      },
      background: {
        default: '#bbdefb',
        paper: '#90caf9',
      },
    },
  },
  ocean: {
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            background: 'linear-gradient(145deg, #678798, #000000) no-repeat fixed', // Deep Space
          },
        },
      },
      MuiAccordionDetails: {
        root: {
          padding: 0,
        }
      },
    },
    palette: {
      type: 'dark',
      primary: {
        main: '#cfd8dc',
      },
      secondary: {
        main: '#7986cb',
      },
      background: {
        default: '#263238',
        paper: '#455a64',
      },
      error: {
        main: '#f50057',
      },
      warning: {
        main: '#ff6d00',
      },
      divider: '#8c8c8c',
    },
  },
};


