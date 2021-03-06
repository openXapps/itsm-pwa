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
import { validateToken } from '../../service/RSSOService';
import { putARSettingsAction } from '../../service/SettingsService';
import { getRequest, requestModel } from '../../service/RequestService';
import { postApproval } from '../../service/ApprovalService';
import RequestDetails from '../Shared/RequestDetails';
import useStyles from './ApprovalStyles';

const ApprovalREQ = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const [assessed, setAssessed] = useState(true);
  const [reqData, setReqData] = useState(requestModel);
  const { apid, reqid } = useParams();
  const [justification, setJustification] = useState('');
  const [snackState, setSnackState] = useState({ severity: 'success', message: 'X', show: false, duration: 3000 });

  useEffect(() => {
    validateToken(false).then(response => {
      if (response) {
        handleDataLoad();
      } else {
        dispatch({ type: 'AUTH', payload: false });
        setSnackState({ severity: 'error', message: 'Session expired', show: true, duration: 4000 });
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
        getRequest(reqid)
          .then(response => {
            // console.log('getRequest: response...', response.json());
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getRequest: data...', data);
                if (data.entries.length === 1) populateRequest(data.entries);
                setAssessed(false);
                setSnackState({ severity: 'info', message: 'Request details fetched', show: true, duration: 3000 });
              });
            }
          }).catch(error => {
            // console.log('getRequest: error...', error);
            setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
          }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
      }, 1000);
    } else {
      setSnackState({ severity: 'info', message: 'Session expired', show: true, duration: 3000 });
    }
  }

  const populateRequest = (data) => {
    // console.log('populateRequest: data', data);
    // let details = String(data[0].values['SR Type Field 1']).split('\n');
    setReqData({
      ...requestModel,
      requestId: reqid,
      summary: data[0].values['Summary'],
      firstName: data[0].values['First Name'],
      lastName: data[0].values['Last Name'],
      submitDate: userDate(data[0].values['Submit Date'], true),
      details: String(data[0].values['SR Type Field 1']).split('\n'),
    });
  };

  const onJustificationChange = (e) => {
    if (e.target.value) {
      setJustification(e.target.value);
    } else {
      setJustification('');
    }
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
      dispatch({ type: 'PROGRESS', payload: true });
      const justificationNote = justification ? justification : 'No justification';
      const data = `{ "values": {
        "approvalAction": "${action}",
        "signatureId":   "${apid}",
        "applicationId": "${reqid}",
        "justification": "${justificationNote}"
      }}`;
      postApproval(data)
        .then(response => {
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
                setSnackState({ severity: 'success', message: 'Request was ' + action, show: true, duration: 3000 });
              } else {
                setSnackState({ severity: 'error', message: 'Approval failed: ' + data.values.shortDescription, show: true, duration: 1000 });
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
    <Container maxWidth="md">
      <Box my={{ xs: 2, md: 3 }} display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <Typography className={classes.header} variant="h6">Service Request Approval</Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => history.goBack()}
          disabled={state.showProgress}
        >Back</Button>
      </Box>
      <RequestDetails reqData={reqData} />
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
      <Toolbar />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
        open={snackState.show}
        autoHideDuration={snackState.duration}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}
      >{snackState.message}</Alert></Snackbar>
    </Container>
  );
};

export default ApprovalREQ;