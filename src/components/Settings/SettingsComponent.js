import {
  useEffect,
  useState,
  useContext,
} from 'react';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
// import TextField from '@material-ui/core/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import useStyles from './SettingsStyles';
import { context } from '../../context/StoreProvider';
import {
  putARSettings,
  postARSettings,
  getARSettings,
  settingsModel
} from '../../service/SettingsService';
import { themeList } from '../../service/ThemeService';
import { getLocalSettings, saveLocalStorage } from '../../utilities/localstorage';
import { storageObjects } from '../../utilities/defaultdata';
import { modules } from '../../utilities/defaultdata';

/**
theme: string,
approvals: boolean,
incidents: boolean,
changes: boolean,
problems: boolean,
assets: boolean,
people: boolean,
 */

const initialFieldData = () => {
  let result = settingsModel;
  const settings = getLocalSettings();
  if (settings.statusOK) result = settings.data;
  return result;
};

const SettingsComponent = ({ history }) => {
  const [, dispatch] = useContext(context);
  const classes = useStyles();
  const [fields, setFields] = useState(initialFieldData());
  const [settingsId, setSettingsId] = useState(getLocalSettings().data.settingsId);
  const [isSaved, setIsSaved] = useState(fields.settingsId ? true : false);
  const [criticalErr, setCriticalErr] = useState({ status: false, message: '' });
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'X', show: false });

  useEffect(() => {
    if (!settingsId) {
      getARSettings()
        .then(response => {
          console.log('SettingsComponent: useEffect.response...', response);
          if (!response.ok) throw new Error('Critical ERR ' + response.status + ' : ' + response.statusText);
          return response.json();
        }).then(data => {
          // console.log('SettingsComponent: get JSON...', data);
          if (data.entries.length > 0) {
            setSettingsId(data.entries[0].values.requestId);
            setFields({
              settingsId: data.entries[0].values.requestId,
              theme: data.entries[0].values.theme,
              approvals: data.entries[0].values.showApproval === 'true' ? true : false,
              incidents: data.entries[0].values.showIncident === 'true' ? true : false,
              changes: data.entries[0].values.showChange === 'true' ? true : false,
              problems: data.entries[0].values.showProblem === 'true' ? true : false,
              assets: data.entries[0].values.showAsset === 'true' ? true : false,
              people: data.entries[0].values.showPeople === 'true' ? true : false,
            });
          }
        }).catch(err => {
          setCriticalErr({ status: true, message: err.message })
          setSnackState({ severity: 'error', message: err.message, show: true });
        });
    }
    return () => { };
  }, [settingsId]);

  const handleFieldChange = ({ target: { name, value } }) => {
    // console.log('SettingsComponent: on change name........', name);
    // console.log('SettingsComponent: on change value.......', value);
    // console.log('--------------------------------------------------------');
    setFields({
      ...fields,
      [name]: value,
    });
    // if (name === 'theme') dispatch({ type: 'THEME', payload: value });
    if (isSaved) setIsSaved(false);
  };

  const handleSaveButton = () => {
    const data = `{ "values": {
      "theme":        "${fields.theme}",
      "showApproval": "${fields.approvals}",
      "showIncident": "${fields.incidents}",
      "showChange":   "${fields.changes}",
      "showProblem":  "${fields.problems}",
      "showAsset":    "${fields.assets}",
      "showPeople":   "${fields.people}"
    }}`;
    if (criticalErr.status) {
      setSnackState({ severity: 'error', message: criticalErr.message, show: true });
      return;
    }
    if (!fields.theme) {
      setSnackState({ severity: 'error', message: 'Must have a theme', show: true });
      return;
    }
    dispatch({ type: 'THEME', payload: fields.theme });
    if (!settingsId) {
      postARSettings(data)
        .then((response) => {
          // console.log('SettingsComponent: submit RES...', response);
          if (response.status !== 201) throw new Error('ERR ' + response.status + ' : ' + response.statusText);
          return response.json();
        }).then(data => {
          // console.log('SettingsComponent: submit JSON...', data);
          if (!data.values.requestId) throw new Error('Settings ID error on submit');
          saveLocalStorage(storageObjects.settings, { ...fields, settingsId: data.values.requestId });
          setFields({ ...fields, settingsId: data.values.requestId });
          setSettingsId(data.values.requestId);
          setIsSaved(true);
          setSnackState({ severity: 'success', message: 'Settings created', show: true });
        }).catch(err => {
          // console.log('SettingsComponent: submit ERR...', err);
          setSnackState({ severity: 'error', message: err.message, show: true });
        });
    } else {
      putARSettings(settingsId, data)
        .then((response) => {
          // console.log('SettingsComponent: update RES...', response);
          if (response.status !== 204) throw new Error('ERR ' + response.status + ' : ' + response.statusText);
          saveLocalStorage(storageObjects.settings, fields);
          setIsSaved(true);
          setSnackState({ severity: 'success', message: 'Settings updated', show: true });
        }).catch(err => {
          // console.log('SettingsComponent: update ERR...', err);
          setSnackState({ severity: 'error', message: err.message, show: true });
        });
    }
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2} />
      <Typography variant="h6">Application Settings ({settingsId})</Typography>
      <Box my={2} />
      <Paper component="form" elevation={0} autoComplete="off">
        <Box p={3}>
          {/* <Autocomplete
            value={fields.theme}
            onChange={(e, v) => handleFieldChange({ target: { name: 'theme', value: v } })}
            options={themeList}
            // getOptionLabel={(option) => option.category}
            // https://github.com/mui-org/material-ui/issues/18344
            getOptionLabel={option => typeof option === 'string' ? option : option.themeList}
            renderInput={(params) => (
              <TextField {...params} label="Theme" variant="outlined" />
            )}
          /> */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="sb-itsm-theme-label">Theme</InputLabel>
            <Select
              labelId="sb-itsm-theme-label"
              // id="sb-itsm-theme-picker"
              name="theme"
              value={fields.theme}
              onChange={handleFieldChange}
              label="Theme"
            >
              {themeList.map((v, i) => {
                return (
                  <MenuItem key={i} value={v}>{v}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {modules.map((v, i) => {
            return (
              <Box key={i} mt={3} display="flex" alignItems="center">
                <Typography className={classes.grow} variant="body1">Show {v.label}</Typography>
                <Switch
                  checked={fields[v.name]}
                  onChange={() => handleFieldChange({ target: { name: v.name, value: !fields[v.name] } })}
                />
              </Box>
            );
          })}
        </Box>
      </Paper>
      <Box my={2} />
      <Grid container alignItems="center">
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" fullWidth onClick={handleSaveButton} disabled={isSaved}>Save</Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box pl={{ xs: 0, sm: 1 }} pt={{ xs: 1, sm: 0 }}>
            <Button variant="outlined" fullWidth onClick={() => history.goBack()} >Back</Button>
          </Box>
        </Grid>
      </Grid>
      <Box my={2} />
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