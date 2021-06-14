import {
  useEffect,
  useState,
  useContext
} from 'react';

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
import { context } from '../../context/StoreProvider';
import { modules } from '../../utilities/defaultdata';

const LandingComponent = ({ history }) => {
  const [state,] = useContext(context);
  const classes = useStyles();
  const [snackState, setSnackState] = useState({
    severity: 'info',
    message: 'Not active session, please login',
    show: false
  });

  useEffect(() => {
    if (!state.isAuth) setSnackState({
      severity: 'info',
      message: 'Not active session, please login',
      show: true
    });
    return () => { };
  }, [state.isAuth]);

  const handleGoToModule = () => {
    history.push(modules[0].path);
  }

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md" disableGutters>
      {modules.map((v, i) => {
        return (
          v.hide ? (null) : (
            <Box mt={{ xs: 1, sm: 2 }} key={i}>
              <Paper elevation={0}>
                <Box display="flex" p={{ xs: 1, md: 2 }} alignItems="center">
                  <img className={classes.image} src={v.img} alt={v.name} />
                  <Typography className={classes.title} variant="h5">{v.name}</Typography>
                  {state.isAuth ? (
                    <><Divider orientation="vertical" flexItem />
                      <Box p={1}>
                        <IconButton edge="end" onClick={handleGoToModule}>
                          <KeyboardArrowRightIcon />
                        </IconButton >
                      </Box></>
                  ) : (null)}
                </Box>
              </Paper>
            </Box>
          )
        );
      })}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
        open={snackState.show}
        autoHideDuration={4000}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}>
          {snackState.message}
        </Alert></Snackbar>
    </Container>
  );
};

export default LandingComponent;