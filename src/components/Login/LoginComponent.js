import { useState, useContext } from 'react';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { context } from '../../context/StoreProvider';
import { getJWT, logout } from '../../service/AuthService';
import { storageObjects } from '../../utilities/defaultdata';
import { saveLocalStorage, getSession } from '../../utilities/localstorage';
import { utoa, atou } from '../../utilities/base64';

const initialFieldData = {
  username: getSession().data.user,
  password: atou(getSession().data.pw),
};

const LoginComponent = ({ history }) => {
  const [fields, setFields] = useState(initialFieldData);
  const [state, dispatch] = useContext(context);
  const [lockLoginButton, setLockLoginButton] = useState(false);
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Login successful',
    show: false
  });

  const handleFieldChange = ({ target: { name, value } }) => {
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleLoginButton = () => {
    const session = getSession().data;
    if (fields.username && fields.password) {
      if (session.jwt) logout(false, session.jwt);
      getJWT(fields.username, fields.password)
        .then((response) => {
          // console.log('LoginComponent: RES...', response);
          if (!response.ok) throw new Error(response.statusText);
          return response.text();
        }).then((token) => {
          // console.log('LoginComponent: JWT...', token);
          saveLocalStorage(storageObjects.session, {
            user: fields.username,
            pw: utoa(fields.password),
            jwt: token,
            jwtDate: new Date(),
          });
          setLockLoginButton(true);
          dispatch({ type: 'AUTH', payload: true });
          setSnackState({ severity: 'success', message: 'Login successful', show: true });
        }).catch((err) => {
          // console.log('LoginComponent: ERR...', err);
          setLockLoginButton(false);
          dispatch({ type: 'AUTH', payload: false });
          setSnackState({ severity: 'error', message: 'Login failed', show: true });
        });
    }
  };

  // [{"messageType":"ERROR","messageText":"Authentication failed","messageNumber":623,"messageAppendedText":"gavin.dalton@standardbank.co.za"}]

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2} />
      <Typography variant="h6">User Login</Typography>
      <Box my={{ xs: 1, sm: 2 }} />
      <Paper component="form">
        <Box p={2}>
          <Box mt={{ xs: 1, sm: 2 }} />
          <TextField
            label="Username"
            variant="outlined"
            value={fields.username}
            name="username"
            autoComplete="username"
            onChange={handleFieldChange}
            fullWidth
          />
          <Box mt={2} />
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
      <Box my={{ xs: 1, sm: 2 }} />
      <Grid container alignItems="center">
        <Grid item xs={12} sm={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleLoginButton}
            disabled={lockLoginButton}
          >Login</Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box pl={{ xs: 0, sm: 1 }} pt={{ xs: 0.5, sm: 0 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => history.goBack()}
            >Back</Button></Box>
        </Grid>
      </Grid>
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