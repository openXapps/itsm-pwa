import { useEffect, useState, useContext } from 'react';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import useStyles from './LandingStyles';
import { useURLQuery } from '../../hooks/useURLQuery';
import { context } from '../../context/StoreProvider';
import { modules, storageObjects, defaultStorage } from '../../utilities/defaultdata';
import { saveLocalStorage, getLocalSettings } from '../../utilities/localstorage';
import { getJWT, hasValidJWT } from '../../service/RSSOService';

const LandingComponent = ({ history, location }) => {
  const [state, dispatch] = useContext(context);
  const classes = useStyles();
  // If redirect from OAuth2 with code parameter, then source the code value
  const code = useURLQuery(location.search).get('code');
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'x', show: false, duration: 4000 });

  // console.log('LandingComponent: location...', location);

  useEffect(() => {
    // Checks if URL location contains a code parameter and if so, then fetchs token
    if (code) {
      // console.log('HeaderComponent: code.......', code);
      // Before we fetch a new token, first validated the existing token
      if (!hasValidJWT(true)) {
        getJWT(code)
          .then(response => {
            // console.log('HeaderComponent: getJWT response...', response);
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          }).then(token => {
            // console.log('HeaderComponent: getJWT token......', token);
            saveLocalStorage(storageObjects.rsso, {
              accessToken: token.access_token,
              tokenType: token.token_type,
              expiresIn: token.expires_in,
              tokenDate: new Date(),
              refreshToken: token.refresh_token,
            });
            dispatch({ type: 'AUTH', payload: true });
            setSnackState({ severity: 'success', message: 'Login successful', show: true });
            history.replace('/');
          }).catch(error => {
            // console.log('HeaderComponent: getJWT error...', error);
            saveLocalStorage(storageObjects.rsso, defaultStorage.rsso);
            dispatch({ type: 'AUTH', payload: false });
            setSnackState({ severity: 'error', message: 'Login failed', show: true });
          });
      }
    }
    return () => { };
  }, [code, dispatch, history]);

  const handleGoToModule = (e) => {
    const moduleId = parseInt(e.currentTarget.dataset.moduleId);
    history.push(modules[moduleId].path);
  }

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md" disableGutters>
      {modules.map((v, i) => {
        return (
          getLocalSettings().data[v.name] ? (
            <Box mt={{ xs: 2, sm: 3 }} mx={{ xs: 2, md: 3 }} key={i}>
              <Paper elevation={10}>
                <Box display="flex" p={{ xs: 1, md: 2 }} alignItems="center">
                  <img className={classes.image} src={v.img} alt={v.label} />
                  <Typography className={classes.title} variant="h5"
                  >{v.label} <span className={classes.counters}>({Math.floor(Math.random() * 10)})</span></Typography>
                  {state.isAuth ? (
                    <><Divider orientation="vertical" flexItem />
                      <Box p={1}>
                        <IconButton edge="end" onClick={handleGoToModule} data-module-id={i} title={v.label}>
                          <KeyboardArrowRightIcon />
                        </IconButton >
                      </Box></>
                  ) : (null)}
                </Box>
              </Paper>
            </Box>
          ) : (null)
        );
      })}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
        open={snackState.show}
        autoHideDuration={snackState.duration}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}>
          {snackState.message}
        </Alert></Snackbar>
    </Container>
  );
};

export default LandingComponent;