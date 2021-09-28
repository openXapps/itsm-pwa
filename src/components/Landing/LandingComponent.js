import { useState, useContext, useEffect } from 'react';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Badge from '@material-ui/core/Badge';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import useStyles from './LandingStyles';
import useURLQuery from '../../hooks/useURLQuery';
import { context } from '../../context/StoreProvider';
import { modules } from '../../utilities/defaultdata';
import { getLocalStorage } from '../../utilities/localstorage';
import { getTokenWithCode, validateToken, testToken } from '../../service/RSSOService';
import { getModuleCounters, putARSettingsAction } from '../../service/SettingsService';

const LandingComponent = ({ history, location }) => {
  const [state, dispatch] = useContext(context);
  const classes = useStyles();
  const code = useURLQuery(location.search).get('code');
  const settings = getLocalStorage('settings').data;
  const [loadingCounters, setLoadingCounters] = useState(false);
  const [moduleList, setModuleList] = useState(modules);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'x', show: false, duration: 3000 });

  useEffect(() => {
    function loadModuleCounters() {
      setLoadingCounters(true);
      setTimeout(() => {
        // console.log('loadModuleCounters loading...', new Date());
        putARSettingsAction('SET_MODULE_COUNT').then((response) => {
          // console.log('putARSettingsAction response...', response);
          if (response.ok) {
            getModuleCounters().then(response => {
              if (!response.ok) {
                if (response.status === 401) throw new Error('Refresh page again');
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
              return response.json();
            }).then(data => {
              if (data.entries.length > 0) {
                const _modules = [];
                modules.forEach(v => _modules.push({ ...v, count: data.entries[0].values[v.name] }));
                setModuleList(_modules);
              }
            }).catch(error => {
              setSnackState({ severity: 'info', message: error.message, show: true, duration: 3000 });
            });
          }
        }).finally(() => setLoadingCounters(false));
      }, 500);
    }

    // Checks if URL location contains a code parameter and if so, then fetch token
    if (code) {
      if (!state.isAuth) {
        getTokenWithCode(code).then(response => {
          if (response.ok) {
            testToken(response.token);
            dispatch({ type: 'AUTH', payload: true })
            setSnackState({ severity: 'success', message: 'Login successful', show: true, duration: 3000 });
          } else {
            dispatch({ type: 'AUTH', payload: false })
            setSnackState({ severity: 'error', message: 'Login failed', show: true, duration: 3000 });
          }
          history.replace('/');
        });
      }
    } else {
      if (!state.isAuth) {
        validateToken(true).then(response => {
          if (response) dispatch({ type: 'AUTH', payload: true });
        });
      } else {
        loadModuleCounters();
      }
    }
    // Effect clean-up
    return () => { };
    // ***eslint-disable-next-line react-hooks/exhaustive-deps***
  }, [code, dispatch, history, state.isAuth]);

  const handleGoToModule = (e) => {
    const moduleId = parseInt(e.currentTarget.dataset.moduleId);
    history.push(modules[moduleId].path);
  }

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md" disableGutters>
      {/* <Box mt={{ xs: 2, sm: 3 }} mx={{ xs: 2, sm: 3 }}>
        <Paper elevation={10}>
          <Box display="flex" p={{ xs: 1, sm: 2 }} alignItems="center">
            <Badge badgeContent={5} color="error">
              <img className={classes.image} src="./img/itsm-apr-alpha.png" alt="My Approvals" />
            </Badge>
            <Box ml={2} flexGrow={1}>
              <Typography className={classes.title} variant="h6">My Approvals</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box className={classes.progress}>
              <CircularProgress size={30} thickness={3} />
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box mt={{ xs: 2, sm: 3 }} mx={{ xs: 2, sm: 3 }}>
        <Paper elevation={10}>
          <Box display="flex" p={{ xs: 1, sm: 2 }} alignItems="center">
            <img className={classes.image} src="./img/itsm-apr-alpha.png" alt="My Approvals" />
            <Box ml={2} flexGrow={1}>
              <Badge badgeContent={5} color="error">
                <Typography className={classes.title} variant="h6">My Assets</Typography>
              </Badge>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box p={1}>
              <IconButton edge="end" onClick={handleGoToModule} data-module-id={0} title="My Approvals">
                <KeyboardArrowRightIcon />
              </IconButton >
            </Box>
          </Box>
        </Paper>
      </Box> */}
      {moduleList.map((v, i) => {
        return (
          settings[v.name] ? (
            <Box mt={{ xs: 2, sm: 3 }} mx={{ xs: 2, sm: 3 }} key={i}>
              <Paper elevation={10}>
                <Box display="flex" p={{ xs: 1, sm: 2 }} alignItems="center">
                  {state.isAuth ? (
                    <>
                      <Badge badgeContent={v.count} color="error">
                        <img className={classes.image} src={v.img} alt={v.label} />
                      </Badge>
                      <Box ml={2} flexGrow={1}>
                        <Typography className={classes.title} variant="h6">{v.label}</Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      {loadingCounters ? (
                        <Box className={classes.progress}>
                          <CircularProgress size={30} thickness={3} />
                        </Box>
                      ) : (
                        <Box p={1}>
                          <IconButton edge="end" onClick={handleGoToModule} data-module-id={i} title={v.label} disabled={v.count === 0}>
                            <KeyboardArrowRightIcon />
                          </IconButton >
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <img className={classes.image} src={v.img} alt={v.label} />
                      <Box ml={2}><Typography className={classes.title} variant="h6">{v.label}</Typography></Box>
                    </>
                  )}
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
