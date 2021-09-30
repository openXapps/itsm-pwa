import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { context } from '../../context/StoreProvider';
import { userDate } from '../../utilities/datetime';
import {
  getChangeRequest,
  changeRequestModel,
  getChangeWorkInfo,
  changeWorkInfoModel,
  getChangeImpactedAreas,
  changeImpactedAreasModel,
  getChangeAssociations,
  changeAssociationsModel,
} from '../../service/ChangeService';
import { validateToken } from '../../service/RSSOService';
import ChangeDetails from '../Shared/ChangeDetails';
import useStyles from '../Shared/ListStyles';

const ChangeView = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const { crqid } = useParams();
  const [crqData, setCrqData] = useState(changeRequestModel);
  const [crqWorkInfo, setCrqWorkInfo] = useState(changeWorkInfoModel);
  const [crqImpactedAreas, setCrqImpactedAreas] = useState(changeImpactedAreasModel);
  const [crqAssociations, setCrqAssociations] = useState(changeAssociationsModel);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'X', show: false, duration: 3000 });

  useEffect(() => {
    validateToken(false).then(response => {
      if (response) {
        // console.log('ChangeView: effect handleDataLoad...');
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
    // // console.log('handleDataLoad: state...', state);
    if (state.isAuth) {
      dispatch({ type: 'PROGRESS', payload: true });
      // Need a timeout if token is still fresh
      setTimeout(() => {
        getChangeRequest(crqid)
          .then(response => {
            // console.log('getChangeRequest: response...', response);
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getChangeRequest: data...', data);
                if (data.entries.length === 1) populateChange(data.entries);
                setSnackState({ severity: 'info', message: 'Change details fetched', show: true, duration: 3000 });
              });
            }
          }).catch(error => {
            // console.log('getChangeRequest: error...', error);
            setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
          });

        getChangeWorkInfo(crqid)
          .then(response => {
            // console.log('getChangeWorkInfo: response...', response);
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getChangeWorkInfo: data...', data);
                if (data.entries.length > 0) populateWorkInfo(data.entries);
              });
            }
          }).catch(error => console.log('getChangeWorkInfo: error...', error));

        getChangeImpactedAreas(crqid)
          .then(response => {
            // console.log('getChangeImpactedAreas: response...', response);
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getChangeImpactedAreas: data...', data);
                if (data.entries.length > 0) populateImpactedAreas(data.entries);
              });
            }
          }).catch(error => console.log('getChangeImpactedAreas: error...', error));

        getChangeAssociations(crqid)
          .then(response => {
            // console.log('getChangeAssociations: response...', response);
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getChangeAssociations: data...', data);
                if (data.entries.length > 0) populateAssociations(data.entries);
              });
            }
          }).catch(error => console.log('getChangeAssociations: error...', error))
          .finally(() => dispatch({ type: 'PROGRESS', payload: false }));
      }, 1000);
    } else {
      setSnackState({ severity: 'info', message: 'Session expired', show: true, duration: 3000 });
    }
  }

  const populateChange = (data) => {
    // console.log('populateChange: data...', data);
    setCrqData({
      ...changeRequestModel,
      changeId: crqid,
      status: data[0].values['Change Request Status'],
      coordinator: data[0].values['ASCHG'],
      description: data[0].values['Description'],
      notes: data[0].values['Detailed Description'],
      serviceCI: data[0].values['ServiceCI'],
      reason: data[0].values['Reason For Change'],
      impact: data[0].values['Impact'],
      risk: data[0].values['Risk Level'],
      scheduleStart: userDate(data[0].values['Scheduled Start Date'], true),
      scheduleEnd: userDate(data[0].values['Scheduled End Date'], true),
    });
  };

  const populateWorkInfo = (data) => {
    // console.log('populateWorkInfo: data...', data);
    let list = [];
    data.map(v => {
      list.push({
        workLogType: v.values['Work Log Type'],
        detailedDescription: v.values['Detailed Description'],
        workLogSubmitter: v.values['Work Log Submitter'],
        workLogSubmitDate: userDate(v.values['Work Log Submit Date'], false),
      });
      return true;
    });
    setCrqWorkInfo(list);
  };

  const populateImpactedAreas = (data) => {
    // console.log('populateImpactedAreas: data...', data);
    let list = [];
    data.map(v => {
      list.push({
        company: v.values['Company'],
      });
      return true;
    });
    setCrqImpactedAreas(list);
  };

  const populateAssociations = (data) => {
    // console.log('populateImpactedAreas: data...', data);
    let list = [];
    data.map(v => {
      list.push({
        requestType: v.values['Request Type01'],
        requestDescription: v.values['Request Description01'],
      });
      return true;
    });
    setCrqAssociations(list);
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <>
      <Container maxWidth="md">
        <Box my={{ xs: 2, md: 3 }} display="flex" flexWrap="nowrap" alignItems="center">
          <Box flexGrow={1}>
            <Typography className={classes.header} variant="h6">Change Request View</Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => history.goBack()}
            disabled={state.showProgress}
          >Back</Button>
        </Box>
        <ChangeDetails
          crqData={crqData}
          crqImpactedAreas={crqImpactedAreas}
          crqAssociations={crqAssociations}
          crqWorkInfo={crqWorkInfo}
        />
        {/* <Grid container alignItems="center">
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => history.goBack()}
              disabled={state.showProgress}
            >Back</Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box pl={{ xs: 0, sm: 1 }} pt={{ xs: 1, sm: 0 }}>
              <Button
                variant="outlined"
                onClick={handleRejectButton}
                fullWidth
                disabled={assessed}
              >Reject</Button></Box>
          </Grid>
        </Grid> */}
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

export default ChangeView;