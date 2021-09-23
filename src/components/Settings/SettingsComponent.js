import { useEffect, useState, useContext } from 'react';

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
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import useStyles from './SettingsStyles';
import { context } from '../../context/StoreProvider';
import { putARSettings, postARSettings, getARSettings } from '../../service/SettingsService';
import { validateToken } from '../../service/RSSOService';
import { themeList } from '../../service/ThemeService';
import { getLocalStorage, saveLocalStorage } from '../../utilities/localstorage';
import { storageObjects, defaultStorage } from '../../utilities/defaultdata';
import { modules } from '../../utilities/defaultdata';

const initialFieldData = () => {
  let result = defaultStorage.settings;
  const settings = getLocalStorage('settings');
  if (settings.statusOK) result = settings.data;
  return result;
};

const SettingsComponent = ({ history }) => {
  const [state, dispatch] = useContext(context);
  const classes = useStyles();
  const [fields, setFields] = useState(initialFieldData());
  const [settingsId, setSettingsId] = useState(getLocalStorage('settings').data.settingsId);
  const [isSaved, setIsSaved] = useState(false);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'X', show: false, duration: 3000 });

  useEffect(() => {
    validateToken(false).then(response => {
      if (response) {
        handleReload();
      } else {
        dispatch({ type: 'AUTH', payload: false });
        setSnackState({ severity: 'error', message: 'Session expired', show: true, duration: 3000 });
      }
    });
    // Effect clean-up
    return () => true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReload = () => {
    if (state.isAuth) {
      dispatch({ type: 'PROGRESS', payload: true });
      getARSettings().then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            dispatch({ type: 'AUTH', payload: false });
            throw new Error('Session expired');
          } else {
            throw new Error('ERR: ' + response.status + ' ' + response.statusText);
          }
        }
        return response.json();
      }).then(data => {
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
          setSnackState({ severity: 'info', message: 'Settings fetched', show: true, duration: 3000 });
        }
      }).catch(error => {
        setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
      }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
    }
  };

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
    // Validate theme field
    if (!fields.theme) {
      setSnackState({ severity: 'error', message: 'Must have a theme', show: true, duration: 3000 });
      return;
    }
    // Validate auth state before submit
    validateToken(false).then(response => {
      if (!response) {
        dispatch({ type: 'AUTH', payload: false });
        setSnackState({ severity: 'error', message: 'Session expired, try again', show: true, duration: 3000 });
      } else {
        const data = `{ "values": {
          "theme":        "${fields.theme}",
          "showApproval": "${fields.approvals}",
          "showIncident": "${fields.incidents}",
          "showChange":   "${fields.changes}",
          "showProblem":  "${fields.problems}",
          "showAsset":    "${fields.assets}",
          "showPeople":   "${fields.people}"
        }}`;
        if (state.theme !== fields.theme) dispatch({ type: 'THEME', payload: fields.theme });
        dispatch({ type: 'PROGRESS', payload: true });
        if (!settingsId) {
          postARSettings(data)
            .then((response) => {
              // console.log('SettingsComponent: submit RES...', response);
              if (response.status !== 201) throw new Error('ERR ' + response.status + ' : ' + response.statusText);
              return response.json();
            }).then(data => {
              // console.log('SettingsComponent: submit JSON...', data);
              if (!data.values.requestId) throw new Error('Settings ID error on submit');
              saveLocalStorage(storageObjects.settings, {
                ...fields,
                settingsId: data.values.requestId,
                appVersion: defaultStorage.settings.appVersion,
              });
              setFields({ ...fields, settingsId: data.values.requestId });
              setSettingsId(data.values.requestId);
              setIsSaved(true);
              setSnackState({ severity: 'success', message: 'Settings created', show: true, duration: 3000 });
            }).catch(err => {
              // console.log('SettingsComponent: submit ERR...', err);
              setSnackState({ severity: 'error', message: err.message, show: true, duration: 3000 });
            }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
        } else {
          putARSettings(settingsId, data)
            .then((response) => {
              if (response.status !== 204) throw new Error('ERR ' + response.status + ' : ' + response.statusText);
              saveLocalStorage(storageObjects.settings, { ...fields, appVersion: defaultStorage.settings.appVersion, });
              setIsSaved(true);
              setSnackState({ severity: 'success', message: 'Settings updated', show: true, duration: 3000 });
            }).catch(err => {
              setSnackState({ severity: 'error', message: err.message, show: true, duration: 3000 });
            }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
        }
      }
    });
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={3} display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <Typography className={classes.header} variant="h6">Application Settings</Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => history.goBack()}
          disabled={state.showProgress}
        >Back</Button>
      </Box>
      <Box my={3}>
        <Paper component="form" elevation={0} autoComplete="off">
          <Box p={3}>
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
                    <MenuItem key={i} value={v.themeId}>{v.themeAlias}</MenuItem>
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
      </Box>
      <Grid container alignItems="center">
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" fullWidth onClick={handleSaveButton} disabled={isSaved}>Save</Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box ml={{ xs: 0, sm: 1 }} mt={{ xs: 1, sm: 0 }}>
            <Button variant="outlined" fullWidth onClick={() => history.goBack()} disabled={state.showProgress}>Back</Button>
          </Box>
        </Grid>
      </Grid>
      <Box my={2} />
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

export default SettingsComponent;