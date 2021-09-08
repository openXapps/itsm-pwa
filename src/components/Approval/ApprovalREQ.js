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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';

import { context } from '../../context/StoreProvider';
import { userDate } from '../../utilities/datetime';
import { validateToken } from '../../service/RSSOService';
import { getServiceRequest, serviceRequestModel } from '../../service/RequestService';
import { postApproval } from '../../service/ApprovalService';
import StyledField from '../Shared/StyledField';
import { RowTitle, RowContent } from '../Shared/StyledTableCell';
import useStyles from './ApprovalStyles';

const ApprovalREQ = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const [assessed, setAssessed] = useState(true);
  const [reqData, setReqData] = useState(serviceRequestModel);
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
      getServiceRequest(reqid)
        .then(response => {
          // console.log('getServiceRequest: response...', response.json());
          if (!response.ok) {
            response.json().then(data => {
              // console.log('getServiceRequest: response false data...', data);
              throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
            }).catch(error => {
              // console.log('getServiceRequest: response false error...', error);
              if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
              setSnackState({ severity: 'error', message: error.message, show: true, duration: 2000 });
            });
          } else {
            return response.json().then(data => {
              // console.log('getServiceRequest: data...', data);
              if (data.entries.length === 1) populateRequest(data.entries);
              setAssessed(false);
              setSnackState({ severity: 'success', message: 'Request details fetched', show: true, duration: 1000 });
            });
          }
        }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
    } else {
      setSnackState({ severity: 'info', message: 'Session expired', show: true, duration: 2000 });
    }
  }

  const populateRequest = (data) => {
    // console.log('populateRequest: data', data);
    // let details = String(data[0].values['SR Type Field 1']).split('\n');
    setReqData({
      ...serviceRequestModel,
      requestId: data[0].values['Request Number'],
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
      const justificationNote = justification ? justification : 'Approved from PWA';
      const data = `{ "values": {
        "approvalAction": "${action}",
        "signatureId":   "${apid}",
        "applicationId": "${reqid}",
        "justification": "${justificationNote}"
      }}`;
      postApproval(data)
        .then(response => {
          if (!response.ok) {
            response.json().then(data => {
              console.log('postApproval: data error...', data);
              throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
            }).catch(error => {
              if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
              setSnackState({ severity: 'error', message: error.message, show: true, duration: 2000 });
            });
          } else {
            response.json().then(data => {
              console.log('postApproval: data ok...', data);
              if (data.values.status === 'Success') {
                setSnackState({ severity: 'success', message: 'Request was ' + action, show: true, duration: 1000 });
              } else {
                setSnackState({ severity: 'error', message: 'Approval failed: ' + data.values.shortDescription, show: true, duration: 1000 });
              }
            }).catch(error => {
              console.log('postApproval: data error...', error);
            });
          }
        }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
    } else {
      setSnackState({ severity: 'info', message: 'Please login first', show: true, duration: 2000 });
    }
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box my={3} display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <Typography className={classes.header} variant="h6">Service Request Approval</Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => history.goBack()}
        >Back</Button>
      </Box>
      <Paper elevation={0}>
        <Box p={{ xs: 1, md: 3 }}>
          <StyledField label="Service Request Details" />
          <Box mt={{ xs: 1, md: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><StyledField label="Request Number" value={reqData.requestId} /></Grid>
            <Grid item xs={12} sm={6}><StyledField label="Summary" value={reqData.summary} /></Grid>
            <Grid item xs={12} sm={6}><StyledField label="Requester" value={reqData.firstName + ' ' + reqData.lastName} /></Grid>
            <Grid item xs={12} sm={6}><StyledField label="Request Date" value={reqData.submitDate} /></Grid>
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Request Content</div></AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table size='small' aria-label="service request content">
                      <TableHead>
                        <TableRow>
                          <TableCell>Questions</TableCell>
                          <TableCell>Answers</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reqData.details.map((v, i) => (
                          v ? (
                            <TableRow key={i} style={{ verticalAlign: 'top' }}>
                              <RowTitle>{v.indexOf(':') > 0 ? (v.slice(0, v.indexOf(':'))) : ''}</RowTitle>
                              <RowContent>{v.slice(v.indexOf(':') + 1)}</RowContent>
                            </TableRow>
                          ) : null
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Box my={2}>
        <TextField
          label="Justification"
          placeholder="Approved from App"
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