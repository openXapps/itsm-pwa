import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Toolbar from '@material-ui/core/Toolbar';

import { context } from '../../context/StoreProvider';
import { userDate } from '../../utilities/datetime';
import { validateToken } from '../../service/RSSOService';
import AssetDetails from '../Shared/AssetDetails';
import useStyles from '../Shared/ListStyles';
import {
  computerSystemModel,
  getComputerSystem,
  customFieldsModel,
  getCustomFields,
} from '../../service/AssetService';

const AssetView = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const { astid } = useParams();
  const [astData, setAstData] = useState(computerSystemModel);
  const [astCustomData, setAstCustomData] = useState(customFieldsModel);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'X', show: false, duration: 3000 });

  useEffect(() => {
    validateToken(false).then(response => {
      if (response) {
        // console.log('AssetDetails: effect handleDataLoad...');
        handleDataLoad();
      } else {
        dispatch({ type: 'AUTH', payload: false });
        setSnackState({ severity: 'error', message: 'Session expired', show: true, duration: 3000 });
      }
    });
    // Effect clean-up
    return () => true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDataLoad = () => {
    // // console.log('AssetDetails: state...', state);
    if (state.isAuth) {
      dispatch({ type: 'PROGRESS', payload: true });
      // Need a timeout if token is still fresh
      setTimeout(() => {
        getComputerSystem(astid)
          .then(response => {
            // console.log('getComputerSystem: response...', response);
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getComputerSystem: data...', data);
                if (data.entries.length === 1) populateAstData(data.entries);
                setSnackState({ severity: 'info', message: 'Asset details fetched', show: true, duration: 3000 });
              });
            }
          }).catch(error => {
            // console.log('getComputerSystem: error...', error);
            setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
          });

        getCustomFields(astid)
          .then(response => {
            // console.log('getCustomFields: response...', response);
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getCustomFields: data...', data);
                if (data.entries.length === 1) populateAstCustomData(data.entries);
                // setSnackState({ severity: 'info', message: 'Asset details fetched', show: true, duration: 3000 });
              });
            }
          }).catch(error => {
            console.log('getCustomFields: error...', error);
            // setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
          }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
      }, 1000);
    } else {
      setSnackState({ severity: 'info', message: 'Session expired', show: true, duration: 3000 });
    }
  }

  const populateAstData = (data) => {
    // console.log('populateAstData: data...', data);
    setAstData({
      ...computerSystemModel,
      name: data[0].values['DNS Host Name'] || data[0].values['Name'],
      serial: data[0].values['Serial Number'],
      tag: data[0].values['Tag Number'] || 'no data',
      class: data[0].values['UserDisplayObjectName'],
      item: data[0].values['Item'],
      model: data[0].values['Model Number'],
      make: data[0].values['Manufacturer Name+'],
      status: data[0].values['AssetLifecycleStatus'],
      scanDate: userDate(data[0].values['LastScanDate'], false),
      costCenter: data[0].values['Cost Center'] || 'no data',
    });
  };

  // ,,,
  const populateAstCustomData = (data) => {
    // console.log('populateAstCustomData: data...', data);
    setAstCustomData({
      ...astCustomData,
      loginUser: data[0].values['Last Logged on User'],
      loginDate: userDate(data[0].values['Last Logged on Date'], false),
      verifyUser: data[0].values['Last Verified By'],
      verifyDate: userDate(data[0].values['Last Verified Date'], false),
    });
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <>
      <Container maxWidth="md">
        <Box my={{ xs: 2, md: 3 }} display="flex" flexWrap="nowrap" alignItems="center">
          <Box flexGrow={1}>
            <Typography className={classes.header} variant="h6">Bank Asset</Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => history.goBack()}
            disabled={state.showProgress}
          >Back</Button>
        </Box>
        <AssetDetails
          astData={astData}
          astCustomData={astCustomData}
        />
      </Container>
      <Toolbar />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
        open={snackState.show}
        autoHideDuration={snackState.duration}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}
      >{snackState.message}</Alert></Snackbar>
    </>
  );
};

export default AssetView;