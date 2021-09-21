import { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import useStyles from './HeaderStyles';
import { context } from '../../context/StoreProvider';
import { localEnvironment, storageObjects, defaultStorage } from '../../utilities/defaultdata';
import { saveLocalStorage, getLocalStorage } from '../../utilities/localstorage';
import { revokeToken } from '../../service/RSSOService';

const HeaderComponent = ({ history, location }) => {
  const classes = useStyles();
  const { appVersion } = getLocalStorage('settings').data;
  const [state, dispatch] = useContext(context);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'x', show: false, duration: 3000 });

  // console.log('HeaderComponent render...');

  const handleLoginButton = () => {
    let url = localEnvironment.ARHOST + '/rsso/oauth2/authorize?response_type=code';
    url += '&client_id=' + localEnvironment.RSSOCLIENTID;
    url += '&client_secret=' + encodeURIComponent(localEnvironment.RSSOSECRET);
    url += '&redirect_uri=' + encodeURIComponent(localEnvironment.WEBHOST + localEnvironment.WEBPATH);
    window.open(url, '_self');
  };

  const handleLogoutButton = () => {
    dispatch({ type: 'PROGRESS', payload: true });
    // revokeToken('refresh_token'); // Doesn't do anything, token still remains in RSSO
    revokeToken('access_token').then(response => {
      // console.log('revokeToken: response...', response);
      if (!response.ok) throw new Error('Logout error');
      saveLocalStorage(storageObjects.rsso, defaultStorage.rsso);
      if (state.isAuth) dispatch({ type: 'AUTH', payload: false });
      setSnackState({ severity: 'success', message: 'Logout successful', show: true, duration: 3000 });
    }).catch(error => {
      // console.log('revokeToken: error...', error);
      setSnackState({ severity: 'error', message: 'Logout failed', show: true, duration: 3000 });
    }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
  };

  const handleSettingsButton = () => {
    history.push('/settings');
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <>
      <AppBar position="fixed" color="inherit">
        <Container maxWidth="md" disableGutters>
          <Toolbar disableGutters>
            <img className={classes.logo} alt="SB Logo" src="./logo192.png" />
            <Typography variant="h6" className={classes.title}
            >IT Service Management <span className={classes.appVersion}><Hidden xsDown>v.{appVersion}</Hidden></span>
            </Typography>
            {state.showProgress ? (<Box mr={1}><CircularProgress /></Box>) : null}
            {location.pathname === '/' ? (
              <div>
                {state.isAuth ? (
                  <Button color="inherit" onClick={handleLogoutButton}>Logout</Button>
                ) : (
                  <Button color="inherit" onClick={handleLoginButton} >Login</Button>
                )}
                <IconButton onClick={handleSettingsButton} disabled={!state.isAuth}>
                  <SettingsIcon />
                </IconButton>
              </div>
            ) : (null)}
          </Toolbar>
        </Container>
      </AppBar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
        open={snackState.show}
        autoHideDuration={snackState.duration}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}
      >{snackState.message}</Alert></Snackbar>
    </>
  );
};

export default withRouter(HeaderComponent);
