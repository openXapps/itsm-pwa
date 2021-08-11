import { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

// import { context } from '../../context/StoreProvider';
// import { getARSettings, settingsModel } from '../../service/SettingsService';
// import { storageObjects } from '../../utilities/defaultdata';
// import { saveLocalStorage, getLocalSession } from '../../utilities/localstorage';

const RSSOComponent = ({ history }) => {
  // const [state, dispatch] = useContext(context);
  const [snackState, setSnackState] = useState({ severity: 'success', message: 'XX', show: false, duration: 2000 });

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2} />
      <Typography variant="h6">Remedy Single Sign-On</Typography>
      <Box my={2} />
      <Paper elevation={0} >
        <Box p={3}>
          <Typography>Here goes your name if RSSO was successful</Typography>
        </Box>
      </Paper>
      <Box my={2} />
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => history.goBack()}
          >Back</Button>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackState.show}
        autoHideDuration={snackState.duration}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}>
          {snackState.message}
        </Alert></Snackbar>
    </Container>
  );
};

export default RSSOComponent;
