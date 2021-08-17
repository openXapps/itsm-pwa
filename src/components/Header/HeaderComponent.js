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
import { application, localEnvironment, storageObjects, defaultStorage } from '../../utilities/defaultdata';
import { saveLocalStorage } from '../../utilities/localstorage';
import { revokeJWT } from '../../service/RSSOService';

const HeaderComponent = ({ history, location }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'x', show: false, duration: 2000 });

  // Button handlers
  const handleLoginButton = () => {
    let url = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + '/rsso/oauth2/authorize?response_type=code';
    url += '&client_id=' + localEnvironment.RSSOCLIENTID;
    url += '&client_secret=' + encodeURIComponent(localEnvironment.RSSOSECRET);
    url += '&redirect_uri=' + encodeURIComponent(localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + '/pwa');
    window.open(url, '_self');
  };
  const handleLogoutButton = () => {
    revokeJWT()
      .then(response => {
        console.log('handleLogoutButton: revokeJWT response...', response);
        //
        if (!response.ok) {
          response.json().then(data => {
            console.log('handleLogoutButton: response false data...', data);
            throw new Error(`Logout failed: ${data.error}`);
          }).catch(error => {
            console.log('handleLogoutButton: response false err...', error);
            setSnackState({ severity: 'error', message: error.message, show: true, duration: 2000 });
          });
        } else {
          if (state.isAuth) dispatch({ type: 'AUTH', payload: false });
          setSnackState({ severity: 'success', message: 'Logout successful', show: true, duration: 2000 });
        }
      });
  };
  const handleSettingsButton = () => {
    history.push('/settings');
  };

  // State handlers
  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <>
      <AppBar position="fixed" color="inherit">
        <Container maxWidth="md" disableGutters>
          <Toolbar disableGutters>
            <img className={classes.logo} alt="SB Logo" src="logo192.png" />
            <Typography variant="h6" className={classes.title}
            >Standard Bank ITSM <span className={classes.appVersion}><Hidden xsDown>v.{application.version}</Hidden></span>
            </Typography>
            {state.showProgress ? (<Box mr={1}><CircularProgress /></Box>) : null}
            {location.pathname === '/' ? (
              <div>
                {state.isAuth ? (
                  <Button color="inherit" onClick={handleLogoutButton}>Logout</Button>
                ) : (
                  <Button color="inherit" onClick={handleLoginButton} >Login</Button>
                )}
                <IconButton className={classes.menuButton} onClick={handleSettingsButton} disabled={!state.isAuth}>
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
