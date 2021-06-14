import {
  // useEffect,
  useState,
  // useContext
} from 'react';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
// import Divider from '@material-ui/core/Divider';
// import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import useStyles from './SettingsStyles';
// import { context } from '../../context/StoreProvider';
// import { modules } from '../../utilities/defaultdata';

const initialFieldData = {
  checkedA: false,
  password: '',
};

const SettingsComponent = ({ history }) => {
  // const [state,] = useContext(context);
  const classes = useStyles();
  const [fields, setFields] = useState(initialFieldData);
  const [snackState, setSnackState] = useState({
    severity: 'info',
    message: 'Not active session, please login',
    show: false
  });

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2} />
      <Typography variant="h6">Application Settings</Typography>
      <Box my={2} />
      <Paper component="form" elevation={0}>
        <Box p={3}>
          <Box display="flex" alignItems="center">
            <Typography className={classes.grow} variant="body1">Show Approvals</Typography>
            <Switch
              checked={fields.checkedA}
              // onChange={handleChange}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Box>
          <Box mt={3} />
          {/* <TextField
            label="Username"
            variant="outlined"
            value={fields.username}
            name="username"
            autoComplete="username"
            // onChange={handleFieldChange}
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
            // onChange={handleFieldChange}
            fullWidth
          /> */}
        </Box>
      </Paper>
      <Box my={2} />
      <Grid container alignItems="center">
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            fullWidth
          >Save</Button>
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

export default SettingsComponent;