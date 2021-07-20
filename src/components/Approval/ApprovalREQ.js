import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
// import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { context } from '../../context/StoreProvider';
import {
  getServiceRequest,
  serviceRequestModel,
} from '../../service/RequestService';

const Field = (props) => {
  const { label, value, font } = props;
  return (
    <Grid container spacing={1}>
      <Grid item xs={value ? 4 : 12}>
        <Typography variant={font || 'body1'}>{label}</Typography>
      </Grid>
      {value ? (
        <Grid item xs={8}>
          <Typography color="primary">{value}</Typography>
        </Grid>
      ) : null}
    </Grid>
  );
};

const ApprovalREQ = ({ history }) => {
  const [state, dispatch] = useContext(context);
  const [assessed, setAssessed] = useState(false);
  const [reqData, setReqData] = useState(serviceRequestModel);
  const {
    // apid, 
    reqid } = useParams();
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'some message',
    show: false,
    duration: 4000,
  });

  useEffect(() => {
    handleDataLoad();
    return () => true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDataLoad = () => {
    // // console.log('ApprovalCRQ: state...', state);
    if (state.isAuth) {
      dispatch({ type: 'PROGRESS', payload: true });
      setTimeout(() => {
        getServiceRequest(reqid)
          .then(response => {
            // console.log('getServiceRequest: response...', response.json());
            if (!response.ok) {
              response.json().then(data => {
                // console.log('getServiceRequest: response false data...', data);
                throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
              }).catch(error => {
                // console.log('getServiceRequest: response false error...', error);
                dispatch({ type: 'PROGRESS', payload: false });
                setAssessed(true);
                if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
                setSnackState({ severity: 'error', message: error.message, show: true, duration: 2000 });
              });
            } else {
              return response.json().then(data => {
                console.log('getServiceRequest: data...', data);
                dispatch({ type: 'PROGRESS', payload: false });
                if (data.entries.length === 1) populateRequest(data.entries);
                setSnackState({ severity: 'success', message: 'Change details fetched', show: true, duration: 1000 });
              });
            }
          });
      }, 1000);
    } else {
      setAssessed(true);
      setSnackState({ severity: 'info', message: 'Please login first', show: true, duration: 2000 });
    }
  }

  const populateRequest = (data) => {
    // console.log('populateRequest: data', data);
    setReqData({
      ...serviceRequestModel,
      requestId: data[0].values['Request Number'],
      summary: data[0].values['Summary'],
      details: data[0].values['SR Type Field 1'],
    });
  };

  const handleApproveButton = () => {
    setAssessed(true);
    setSnackState({ severity: 'info', message: 'Request was approved', show: true });
  };

  const handleRejectButton = () => {
    setAssessed(true);
    setSnackState({ severity: 'info', message: 'Request was rejected', show: true });
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box py={2}>
        <Typography variant="h6">Service Request Approval</Typography>
      </Box>
      <Paper elevation={0}>
        {state.showProgress ? null : (
          <Box p={{ xs: 1, md: 3 }}>
            <Field label="Service Request Details" font="h6" />
            <Box mt={{ xs: 1, md: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><Field label="Request Number" value={reqData.requestId} font="" /></Grid>
              <Grid item xs={12} sm={6}><Field label="Summary" value={reqData.summary} font="" /></Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Request Content</Typography></AccordionSummary>
                  <AccordionDetails><Typography color="primary">{reqData.details}</Typography></AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      <Box my={2} />
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
            >Back</Button></Box>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
        open={snackState.show}
        autoHideDuration={snackState.duration || 4000}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}
      >{snackState.message}</Alert></Snackbar>
    </Container>
  );
};

export default ApprovalREQ;