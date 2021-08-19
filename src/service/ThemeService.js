export const themeList = [
  'light',
  'dark',
  'concrete',
  'monday',
];

// https://uigradients.com

export const themes =
{
  dark: {
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            // background: 'linear-gradient(to right, #141e30, #243b55)', // Royal
            // background: 'linear-gradient(to right, #485563, #29323c)', // ServQuick
            background: 'linear-gradient(to right, #000000, #434343)', // Deep Space
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          },
        },
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
        paper: '#616161',
      },
    },
  },
  light: {
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            background: 'linear-gradient(to right, #ffd89b, #6492b1)', // Jupiter
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          },
        },
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
            // background: 'linear-gradient(to right, #4b79a1, #283e51)', // Dark Skies
            background: 'linear-gradient(to right, #a3a1ad, #928dab)', // Steel Gray
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          },
        },
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
            // background: 'linear-gradient(to right, #1e3c72, #2a5298)', // Joomla
            background: 'linear-gradient(to right, #7ab9e2, #748ba2)', // Nighthawk
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          },
        },
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
};


