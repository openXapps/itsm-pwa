import { useState, useEffect, useContext } from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { context } from '../../context/StoreProvider';
import { getApprovals, approvalModel } from '../../service/ApprovalService';

const Field = (props) => {
  const { label, value, font } = props;
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Typography variant={font || 'body1'}>{label}</Typography>
      </Grid>
      {value ? (
        <Grid item xs={6}>
          <Typography color="primary">{value}</Typography>
        </Grid>
      ) : null}
    </Grid>
  );
};

const ApprovalCRQ = ({ history, location }) => {
  const [state,] = useContext(context);
  const [isLoading, setIsLoading] = useState(false);
  const [approvalData, setApprovalData] = useState({});
  const [crqData, setCrqData] = useState({});
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Login successful',
    show: false
  });

  useEffect(() => {
    if (state.isAuth) handleDataLoad();
    return () => true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isAuth])

  const handleDataLoad = () => {
    // // console.log('ApprovalList: state...', state);
    // if (state.isAuth) {
    //   setIsLoading(true);
    //   getApprovals(getLocalSession().data.user)
    //     .then(response => {
    //       // console.log('ApprovalList: response...', response.json());
    //       if (!response.ok) {
    //         response.json().then(data => {
    //           // console.log('ApprovalList: response false data...', data);
    //           throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
    //         }).catch(err => {
    //           // console.log('ApprovalList: response false err...', err);
    //           setIsLoading(false);
    //           setSnackState({ severity: 'error', message: err.message, show: true });
    //         });
    //       } else {
    //         return response.json().then(data => {
    //           // console.log('ApprovalList: approvals...', data);
    //           setIsLoading(false);
    //           populateApprovals(data.entries);
    //           // setApprovals(data.entries);
    //           setSnackState({ severity: 'success', message: 'Details fetched', show: true });
    //         });
    //       }
    //     });
    // } else {
    //   setSnackState({ severity: 'info', message: 'Please login first', show: true });
    // }
  }

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box py={2}>
        <Typography variant="h6">Approval Details</Typography>
      </Box>
      <Paper component="form" elevation={0}>
        <Box p={3}>
          <Field label="Service Request Approval" font="h6" />
          <Box mt={3} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><Field label="Requester" value="Joe Apple" font="" /></Grid>
            <Grid item xs={12} sm={6}><Field label="Details" value="Can I have a gamers laptop please" font="" /></Grid>
            <Grid item xs={12} sm={6}><Field label="Requester" value="Joe Apple" font="" /></Grid>
            <Grid item xs={12} sm={6}><Field label="Details" value="Can I have a gamers laptop please" font="" /></Grid>
            <Grid item xs={12} sm={6}><Field label="Requester" value="Joe Apple" font="" /></Grid>
            <Grid item xs={12} sm={6}><Field label="Details" value="Can I have a gamers laptop please" font="" /></Grid>
          </Grid>
        </Box>
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