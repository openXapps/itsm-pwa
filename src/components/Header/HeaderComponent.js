import React from 'react';
import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import useStyles from './HeaderStyles';
// import { getDefaultData } from '../../utilities/defaultdata';
// import { context } from '../../context/StoreProvider';

// const HeaderComponent = ({ history, location }) => {
const HeaderComponent = () => {
  // const [state, dispatch] = React.useContext(context);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>Standard Bank ITSM</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(HeaderComponent);
