import { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import useStyles from './HeaderStyles';
import { context } from '../../context/StoreProvider';
import { defaultStorage } from '../../utilities/defaultdata';
import { getSession } from '../../utilities/localstorage';
import { logout } from '../../service/AuthService';

const HeaderComponent = ({ history, location }) => {
  const [state, dispatch] = useContext(context);
  const classes = useStyles();
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Logout successful',
    show: false
  });

  const handleLoginButton = () => {
    history.push('/login');
  };

  const handleLogoutButton = () => {
    logout(getSession().data.jwt);
    dispatch({ type: 'AUTH', payload: false });
    setSnackState({ ...snackState, show: true });
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <img className={classes.logo} alt="SB Logo" src="./logo192.png" />
          <Typography variant="h6" className={classes.title}
          >Standard Bank ITSM <span className={classes.appVersion}><Hidden xsDown>v{defaultStorage.settings.version}</Hidden></span>
          </Typography>
          {location.pathname === '/' ? (
            state.isAuth ? (
              <Button
                color="inherit"
                onClick={handleLogoutButton}
              >Logout</Button>
            ) : (
              <Button
                color="inherit"
                onClick={handleLoginButton}
              >Login</Button>
            )
          ) : (null)}
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackState.show}
        autoHideDuration={4000}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}>
          {snackState.message}
        </Alert></Snackbar>
    </div>
  );
};

export default withRouter(HeaderComponent);
