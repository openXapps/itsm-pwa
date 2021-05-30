import React from 'react';
import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';

import useStyles from './HeaderStyles';
import { defaultStorage } from '../../utilities/defaultdata';
import { context } from '../../context/StoreProvider';

// const HeaderComponent = ({ history, location }) => {
const HeaderComponent = () => {
  const [state, dispatch] = React.useContext(context);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <img className={classes.logo} alt="SB Logo" src="./logo192.png" />
          <Typography variant="h6" className={classes.title}
          >Standard Bank ITSM <span className={classes.appVersion}><Hidden xsDown>v{defaultStorage.settings.version}</Hidden></span>
          </Typography>
          <Button color="inherit">Login</Button>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(HeaderComponent);
