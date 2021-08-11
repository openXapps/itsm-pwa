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
import { application, localEnvironment } from '../../utilities/defaultdata';
// import { getLocalSession } from '../../utilities/localstorage';
import { useEffect } from 'react';

const HeaderComponent = ({ history, location }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Logout successful',
    show: false,
    duration: 2000,
  });
  
  console.log('HeaderComponent: history....', history);
  console.log('HeaderComponent: location...', location);

  useEffect(() => {
    // Need to validate auth state
    return () => { };
  }, []);

  // Button handlers
  const handleLoginButton = () => {
    let oAuthURL = localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + '/rsso/oauth2/authorize?response_type=code';
    oAuthURL += '&client_id=' + localEnvironment.RSSOCLIENTID;
    oAuthURL += '&client_secret=' + localEnvironment.RSSOSECRET;
    oAuthURL += '&redirect_uri=' + localEnvironment.ARPROTOCOL + '://' + localEnvironment.ARHOST + '/pwa';
    // oAuthURL += '&redirect_uri=http://localhost:3000/rsso';
    window.open(oAuthURL, '_self');
    // history.push('/rsso');
  };
  const handleLogoutButton = () => {
    dispatch({ type: 'AUTH', payload: false });
    setSnackState({ ...snackState, show: true });
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
            <img className={classes.logo} alt="SB Logo" src="./logo192.png" />
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
