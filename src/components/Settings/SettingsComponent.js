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
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
// import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import useStyles from './SettingsStyles';
// import { context } from '../../context/StoreProvider';
import { themeList } from '../../service/ThemeService';
import { settingsModel } from '../../service/DataService';
import { getLocalSettings } from '../../utilities/localstorage';
import { modules } from '../../utilities/defaultdata';

const initialFieldData = () => {
  let result = settingsModel;
  const settings = getLocalSettings();
  if (settings.statusOK) result = settings.data;
  return result;
};

const SettingsComponent = ({ history }) => {
  // const [state,] = useContext(context);
  const classes = useStyles();
  const [fields, setFields] = useState(initialFieldData());
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
      <Paper component="form" elevation={0} autoComplete="off">
        <Box p={3}>
          <Autocomplete
            value={fields.theme}
            // onChange={(e, v) => handleFieldChange({ target: { name: 'categoryValue', value: v } })}
            // inputValue={fields.categoryInputValue}
            // onInputChange={(e, v) => handleFieldChange({ target: { name: 'categoryInputValue', value: v } })}
            // options={categories.map((option) => option.category)}
            options={themeList}
            // getOptionLabel={(option) => option.category}
            // https://github.com/mui-org/material-ui/issues/18344
            getOptionLabel={option => typeof option === 'string' ? option : option.themeList}
            renderInput={(params) => (
              <TextField {...params} label="Theme" variant="outlined" fullWidth />
            )}
          />
          {modules.map((v, i) => {
            return (
              <Box key={i} mt={3} display="flex" alignItems="center">
                <Typography className={classes.grow} variant="body1">Show {v.label}</Typography>
                <Switch checked={fields[v.name]} name={v.name} />
              </Box>
            );
          })}
        </Box>
      </Paper>
      <Box my={2} />
      <Grid container alignItems="center">
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" fullWidth >Save</Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box pl={{ xs: 0, sm: 1 }} pt={{ xs: 1, sm: 0 }}>
            <Button variant="outlined" fullWidth onClick={() => history.goBack()} >Back</Button>
          </Box>
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