import { useState, useContext, useEffect } from 'react';

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
import useURLQuery from '../../hooks/useURLQuery';
// import useAuth from '../../hooks/useAuth';
import { context } from '../../context/StoreProvider';
import { modules } from '../../utilities/defaultdata';
import { getLocalStorage } from '../../utilities/localstorage';
import { getTokenWithCode, validateToken } from '../../service/RSSOService';

const LandingComponent = ({ history, location }) => {
  const [state, dispatch] = useContext(context);
  const classes = useStyles();
  const code = useURLQuery(location.search).get('code');
  // console.log('LandingComponent: code...', code);
  // const isTokenValid = useAuth(true);
  // console.log('LandingComponent: useAuth isTokenValid...', isTokenValid);
  // If redirect from OAuth2 with code parameter, then source the code value
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'x', show: false, duration: 4000 });

  // console.log('LandingComponent: render...');

  useEffect(() => {
    // Checks if URL location contains a code parameter and if so, then fetchs token
    if (code) {
      if (getTokenWithCode(code)) {
        dispatch({ type: 'AUTH', payload: true })
        setSnackState({ severity: 'success', message: 'Login successful', show: true, duration: 2000 });
      } else {
        dispatch({ type: 'AUTH', payload: false })
        setSnackState({ severity: 'error', message: 'Login failed', show: true, duration: 3000 });
      }
      history.replace('/');
    } else {
      // console.log('LandingComponent: effect calling validateToken...');
      validateToken(true).then(response => {
        if (response && !state.isAuth) dispatch({ type: 'AUTH', payload: true });
      });
    }

    return () => { };
  }, [code, history, state.isAuth, dispatch]);

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
          getLocalStorage('settings').data[v.name] ? (
            <Box mt={{ xs: 2, sm: 3 }} mx={{ xs: 2, md: 3 }} key={i}>
              <Paper elevation={10}>
                <Box display="flex" p={{ xs: 1, md: 2 }} alignItems="center">
                  <img className={classes.image} src={v.img} alt={v.label} />
                  <Typography className={classes.title} variant="h5"
                  >{v.label} {state.isAuth && <span className={classes.counters}>({Math.floor(Math.random() * 10)})</span>}</Typography>
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
