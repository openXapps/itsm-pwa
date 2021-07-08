import { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import useStyles from './HeaderStyles';
import { context } from '../../context/StoreProvider';
import { application } from '../../utilities/defaultdata';
import { getLocalSession } from '../../utilities/localstorage';
import { logout } from '../../service/AuthService';
import { useEffect } from 'react';

const HeaderComponent = ({ history, location }) => {
  const [state, dispatch] = useContext(context);
  const classes = useStyles();
  const user = getLocalSession().data.user;
  const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Logout successful',
    show: false
  });

  useEffect(() => {
    if (user) {
      const fullName = user.slice(0, user.indexOf('@'));
      const firstName = fullName.slice(0, fullName.indexOf('.')).toUpperCase();
      const lastName = fullName.slice(fullName.indexOf('.') + 1, 100).toUpperCase();
      // console.log('HeaderComponent: fullName.,..', fullName);
      // console.log('HeaderComponent: firstName...', firstName);
      // console.log('HeaderComponent: lastName....', lastName);
      setUserName(firstName + ' ' + lastName);
    }
    return () => { };
  }, [user]);

  // Button handlers
  const handleLoginMenu = () => {
    handleMenuClose();
    history.push('/login');
  };
  const handleLogoutMenu = () => {
    handleMenuClose();
    logout(false, getLocalSession().data.jwt);
    dispatch({ type: 'AUTH', payload: false });
    setSnackState({ ...snackState, show: true });
  };
  const handleSettingsButton = () => {
    history.push('/settings');
  };
  const handleMenuButton = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // State handlers
  const handleMenuClose = () => {
    setAnchorEl(null);
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
            >Standard Bank ITSM <span className={classes.appVersion}><Hidden xsDown>v.{application.version}</Hidden></span>
            </Typography>
            {state.showProgress ? (<Box mr={1}><CircularProgress /></Box>) : null}
            {location.pathname === '/' ? (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuButton}
                  color={state.isAuth ? 'primary' : 'inherit'}
                ><AccountCircle /></IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={menuOpen}
                  onClose={handleMenuClose}
                >
                  {state.isAuth ? (
                    <MenuItem color="inherit" onClick={handleLogoutMenu}>Logout</MenuItem>
                  ) : (
                    <MenuItem color="inherit" onClick={handleLoginMenu} >Login</MenuItem>
                  )}
                  <MenuItem onClick={handleMenuClose} disabled={!state.isAuth}>{userName}</MenuItem>
                </Menu>
                <IconButton className={classes.menuButton} onClick={handleSettingsButton}>
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
        autoHideDuration={4000}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}
      >{snackState.message}</Alert></Snackbar>
    </>
  );
};

export default withRouter(HeaderComponent);
