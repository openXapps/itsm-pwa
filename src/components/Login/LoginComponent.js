import { useState, useContext } from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { context } from '../../context/StoreProvider';
import { getJWT } from '../../service/AuthService';
import { getARSettings, settingsModel } from '../../service/SettingsService';
import { storageObjects } from '../../utilities/defaultdata';
import { saveLocalStorage, getLocalSession } from '../../utilities/localstorage';

const initialFieldData = {
  username: getLocalSession().data.user,
  password: '',
};

const LoginComponent = ({ history }) => {
  const [fields, setFields] = useState(initialFieldData);
  const [state, dispatch] = useContext(context);
  const [lockLoginButton, setLockLoginButton] = useState(false);
  const [snackState, setSnackState] = useState({ severity: 'success', message: 'XX', show: false });

  const handleFieldChange = ({ target: { name, value } }) => {
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleLoginButton = (e) => {
    e.preventDefault();
    if (fields.username && fields.password) {
      getJWT(fields.username, fields.password)
        .then(response => {
          // console.log('LoginComponent: JWT response...', response);
          if (!response.ok) throw new Error(response.statusText);
          return response.text();
        }).then(token => {
          // console.log('LoginComponent: JWT token......', token);
          saveLocalStorage(storageObjects.session, {
            user: fields.username,
            jwt: token,
            jwtDate: new Date(),
          });
          setLockLoginButton(true);
          dispatch({ type: 'AUTH', payload: true });
          setSnackState({ severity: 'success', message: 'Authentication successful', show: true });
        }).catch(error => {
          // console.log('LoginComponent: JWT error...', error);
          setLockLoginButton(false);
          dispatch({ type: 'AUTH', payload: false });
          setSnackState({ severity: 'error', message: 'Authentication failed', show: true });
        });

      // Need to validate settings about 1.5 seconds after login
      setTimeout(() => {
        getARSettings()
          .then(response => {
            // console.log('LoginComponent: settings response...', response);
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          }).then(data => {
            // console.log('LoginComponent: settings data.......', data);
            if (data.entries.length > 0) {
              saveLocalStorage(storageObjects.settings, {
                settingsId: data.entries[0].values.requestId,
                theme: data.entries[0].values.theme,
                approvals: data.entries[0].values.showApproval === 'true' ? true : false,
                incidents: data.entries[0].values.showIncident === 'true' ? true : false,
                changes: data.entries[0].values.showChange === 'true' ? true : false,
                problems: data.entries[0].values.showProblem === 'true' ? true : false,
                assets: data.entries[0].values.showAsset === 'true' ? true : false,
                people: data.entries[0].values.showPeople === 'true' ? true : false,
              });
              if (state.theme !== data.entries[0].values.theme) dispatch({ type: 'THEME', payload: data.entries[0].values.theme });
            } else {
              saveLocalStorage(storageObjects.settings, settingsModel);
              if (state.theme !== settingsModel.theme) dispatch({ type: 'THEME', payload: settingsModel.theme });
            }
          }).catch(error => {
            // console.log('LoginComponent: settings error...', error);
            // setSnackState({ severity: 'error', message: 'Authentication failed', show: true });
          });
      }, 1500);
    }
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2} />
      <Typography variant="h6">User Login</Typography>
      <Box my={2} />
      <form onSubmit={handleLoginButton}>
        <Paper elevation={0} >
          <Box p={3}>
            <TextField
              label="Username"
              variant="outlined"
              value={fields.username}
              name="username"
              autoComplete="username"
              onChange={handleFieldChange}
              fullWidth
            />
            <Box mt={3} />
            <TextField
              label="Password"
              variant="outlined"
              value={fields.password}
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={handleFieldChange}
              fullWidth
            />
          </Box>
        </Paper>
        <Box my={2} />
        <Grid container alignItems="center">
          <Grid item xs={12} sm={6}>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              onClick={handleLoginButton}
              disabled={lockLoginButton}
            >Login</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box pl={{ xs: 0, sm: 1 }} pt={{ xs: 1, sm: 0 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => history.goBack()}
              >Back</Button></Box>
          </Grid>
        </Grid>
      </form>
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
    </Container>
  );
};

export default LoginComponent;
