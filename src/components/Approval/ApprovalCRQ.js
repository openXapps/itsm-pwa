import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { context } from '../../context/StoreProvider';
import { userDate } from '../../utilities/datetime';
import { getChangeRequest, changeRequestModel } from '../../service/ChangeService';

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

const ApprovalCRQ = ({ history }) => {
  const [state, dispatch] = useContext(context);
  const { apid, crqid } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  // const [approvalData, setApprovalData] = useState({});
  const [crqData, setCrqData] = useState(changeRequestModel);
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Login successful',
    show: false
  });

  // console.log('ApprovalCRQ: params.....', apid, crqid);

  useEffect(() => {
    handleDataLoad();
    return () => true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDataLoad = () => {
    // // console.log('ApprovalCRQ: state...', state);
    if (state.isAuth) {
      setIsLoading(true);
      getChangeRequest(crqid)
        .then(response => {
          // console.log('ApprovalCRQ: response...', response.json());
          if (!response.ok) {
            response.json().then(data => {
              // console.log('ApprovalCRQ: response false data...', data);
              throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
            }).catch(error => {
              // console.log('ApprovalCRQ: response false error...', error);
              setIsLoading(false);
              if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
              setSnackState({ severity: 'error', message: error.message, show: true });
            });
          } else {
            return response.json().then(data => {
              // console.log('ApprovalCRQ: approvals...', data);
              setIsLoading(false);
              if (data.entries.length === 1) populateChange(data.entries);
              setSnackState({ severity: 'success', message: 'Change details fetched', show: true });
            });
          }
        });
    } else {
      setSnackState({ severity: 'info', message: 'Please login first', show: true });
    }
  }

  const populateChange = (data) => {
    // console.log('populateChange: data', data);
    setCrqData({
      ...changeRequestModel,
      changeId: data[0].values['Infrastructure Change ID'],
      status: data[0].values['Change Request Status'],
      coordinator: data[0].values['ASCHG'],
      description: data[0].values['Description'],
      notes: data[0].values['Detailed Description'],
      serviceCI: data[0].values['ServiceCI'],
      impact: data[0].values['Impact'],
      risk: data[0].values['Risk Level'],
      scheduleStart: userDate(data[0].values['Scheduled Start Date'], true),
      scheduleEnd: userDate(data[0].values['Scheduled End Date'], true),
    });
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box py={2}>
        <Typography variant="h6">Change Request Approval</Typography>
      </Box>
      <Paper elevation={0}>
        {!isLoading ? (
          <Box p={3}>
            <Field label="Change Request Details" font="h6" />
            <Box mt={3} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><Field label="Change Number" value={crqData.changeId} font="" /></Grid>
              <Grid item xs={12} sm={6}><Field label="Status" value={crqData.status} font="" /></Grid>
              <Grid item xs={12} sm={6}><Field label="Coordinator" value={crqData.coordinator} font="" /></Grid>
              <Grid item xs={12} sm={6}><Field label="Description" value={crqData.description} font="" /></Grid>
              <Grid item xs={12} sm={6}><Field label="Service CI" value={crqData.serviceCI} font="" /></Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} sm={6}><Field label="Impact" value={crqData.impact} font="" /></Grid>
              <Grid item xs={12} sm={6}><Field label="Risk Level" value={crqData.risk} font="" /></Grid>
              <Grid item xs={12} sm={6}><Field label="Start Date" value={crqData.scheduleStart} font="" /></Grid>
              <Grid item xs={12} sm={6}><Field label="End Date" value={crqData.scheduleEnd} font="" /></Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Change Notes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{crqData.notes}</Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Paper>
      <Box my={2} />
      <Grid container alignItems="center">
        <Grid item xs={12} sm={4}>
          <Button
            variant="outlined"
            fullWidth
          >Approve</Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box pl={{ xs: 0, sm: 1 }} pt={{ xs: 1, sm: 0 }}>
            <Button
              variant="outlined"
              fullWidth
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
        autoHideDuration={4000}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}
      >{snackState.message}</Alert></Snackbar>
    </Container>
  );
};

export default ApprovalCRQ;