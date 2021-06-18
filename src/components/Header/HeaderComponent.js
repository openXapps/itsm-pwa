import { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SettingsIcon from '@material-ui/icons/Settings';
import Hidden from '@material-ui/core/Hidden';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import useStyles from './HeaderStyles';
import { context } from '../../context/StoreProvider';
import { application } from '../../utilities/defaultdata';
import { getLocalSession } from '../../utilities/localstorage';
import { logout } from '../../service/AuthService';

const HeaderComponent = ({ history, location }) => {
  const [state, dispatch] = useContext(context);
  const classes = useStyles();
  const [drawerState, setDrawerState] = useState(false);
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Logout successful',
    show: false
  });

  // Button handlers
  const handleLoginButton = () => {
    history.push('/login');
  };
  const handleLogoutButton = () => {
    logout(false, getLocalSession().data.jwt);
    dispatch({ type: 'AUTH', payload: false });
    setSnackState({ ...snackState, show: true });
  };
  const handleSettingsButton = () => {
    history.push('/settings');
  };

  // State handlers
  const handleDrawerState = () => {
    setDrawerState(!drawerState);
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
            >Standard Bank ITSM <span className={classes.appVersion}><Hidden xsDown>v{application.version}</Hidden></span>
            </Typography>
            {location.pathname === '/' ? (
              <>
                {state.isAuth ? (
                  <Button color="inherit" onClick={handleLogoutButton}>Logout</Button>
                ) : (
                  <Button color="inherit" onClick={handleLoginButton} >Login</Button>
                )}
                <IconButton className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleDrawerState}>
                  <MenuIcon />
                </IconButton>
              </>
            ) : (null)}
          </Toolbar>
        </Container>
      </AppBar>
      {/* <Toolbar /> */}
      <Drawer anchor="right" open={drawerState} onClose={handleDrawerState}>
        <div className={classes.drawerSize} onClick={handleDrawerState}>
          <Box p={1}>
            <Button onClick={handleDrawerState} fullWidth><ChevronRightIcon /></Button>
          </Box>
          <Divider />
          <List>
            <ListItem button onClick={handleSettingsButton} disabled={!state.isAuth}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </div>
      </Drawer>
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
