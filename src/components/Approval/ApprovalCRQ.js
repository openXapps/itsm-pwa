import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';

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
import { putARSettingsAction } from '../../service/SettingsService';
import { postApproval } from '../../service/ApprovalService';
import ChangeDetails from '../Shared/ChangeDetails';
import useStyles from './ApprovalStyles';

const ApprovalCRQ = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const { apid, crqid } = useParams();
  const [assessed, setAssessed] = useState(true);
  const [crqData, setCrqData] = useState(changeRequestModel);
  const [crqWorkInfo, setCrqWorkInfo] = useState(changeWorkInfoModel);
  const [crqImpactedAreas, setCrqImpactedAreas] = useState(changeImpactedAreasModel);
  const [crqAssociations, setCrqAssociations] = useState(changeAssociationsModel);
  const [justification, setJustification] = useState('');
  const [snackState, setSnackState] = useState({ severity: 'success', message: 'X', show: false, duration: 3000 });

  useEffect(() => {
    validateToken(false).then(response => {
      if (response) {
        // console.log('ApprovalCRQ: effect handleDataLoad...');
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
    // // console.log('ApprovalCRQ: state...', state);
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
                setAssessed(false);
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
      changeId: data[0].values['Infrastructure Change ID'],
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

  const onJustificationChange = (e) => {
    if (e.target.value) setJustification(e.target.value);
  };

  const handleApproveButton = () => {
    doApproval('Approved');
  };

  const handleRejectButton = () => {
    doApproval('Rejected');
  };

  const doApproval = (action) => {
    setAssessed(true);
    if (state.isAuth) {
      const justificationNote = justification ? justification : 'No justification';
      const data = `{ "values": {
        "approvalAction": "${action}",
        "signatureId":   "${apid}",
        "applicationId": "${crqid}",
        "justification": "${justificationNote}"
      }}`;
      dispatch({ type: 'PROGRESS', payload: true });
      postApproval(data)
        .then(response => {
          // console.log('postApproval: response...', response);
          if (!response.ok) {
            if (response.status === 401) {
              dispatch({ type: 'AUTH', payload: false });
              throw new Error('Session expired');
            } else {
              throw new Error('ERR: ' + response.status + ' ' + response.statusText);
            }
          } else {
            response.json().then(data => {
              if (data.values.status === 'Success') {
                setSnackState({ severity: 'success', message: 'Change was ' + action, show: true, duration: 3000 });
              } else {
                setSnackState({ severity: 'error', message: 'Approval failed: ' + data.values.shortDescription, show: true, duration: 3000 });
              }
            }).catch(error => { console.log('postApproval: data error...', error) });
          }
        }).catch(error => {
          // console.log('postApproval: error...', error);
          setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
        }).finally(() => {
          dispatch({ type: 'PROGRESS', payload: false });
          putARSettingsAction('SET_MODULE_COUNT').catch(error => console.log('putARSettingsAction: error...', error));
        });
    } else {
      setSnackState({ severity: 'info', message: 'Please login first', show: true, duration: 3000 });
    }
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <>
      <Container maxWidth="md">
        <Box my={{ xs: 2, md: 3 }} display="flex" flexWrap="nowrap" alignItems="center">
          <Box flexGrow={1}>
            <Typography className={classes.header} variant="h6">Change Request Approval</Typography>
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
        <Box my={2}>
          <TextField
            label="Justification"
            placeholder="No justification"
            variant="outlined"
            fullWidth
            value={justification}
            onChange={onJustificationChange}
          />
        </Box>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              onClick={handleApproveButton}
              fullWidth
              disabled={assessed}
            >Approve</Button>
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
          <Grid item xs={12} sm={4}>
            <Box pl={{ xs: 0, sm: 1 }} pt={{ xs: 1, sm: 0 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => history.goBack()}
                disabled={state.showProgress}
              >Back</Button></Box>
          </Grid>
        </Grid>
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

export default ApprovalCRQ;