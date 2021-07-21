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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Toolbar } from '@material-ui/core';

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
import StyledField from '../Shared/StyledField';
import StyledTableCell from '../Shared/StyledTableCell';

const ApprovalCRQ = ({ history }) => {
  const [state, dispatch] = useContext(context);
  const {
    // apid, 
    crqid } = useParams();
  const [assessed, setAssessed] = useState(false);
  const [crqData, setCrqData] = useState(changeRequestModel);
  const [crqWorkInfo, setCrqWorkInfo] = useState(changeWorkInfoModel);
  const [crqImpactedAreas, setCrqImpactedAreas] = useState(changeImpactedAreasModel);
  const [crqAssociations, setCrqAssociations] = useState(changeAssociationsModel);
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Login successful',
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
        getChangeRequest(crqid)
          .then(response => {
            // console.log('ApprovalCRQ: response...', response.json());
            if (!response.ok) {
              response.json().then(data => {
                // console.log('getChangeRequest: response false data...', data);
                throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
              }).catch(error => {
                // console.log('getChangeRequest: response false error...', error);
                dispatch({ type: 'PROGRESS', payload: false });
                setAssessed(true);
                if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
                setSnackState({ severity: 'error', message: error.message, show: true, duration: 2000 });
              });
            } else {
              return response.json().then(data => {
                // console.log('getChangeRequest: data...', data);
                dispatch({ type: 'PROGRESS', payload: false });
                if (data.entries.length === 1) populateChange(data.entries);
                setSnackState({ severity: 'success', message: 'Change details fetched', show: true, duration: 1000 });
              });
            }
          });
        getChangeWorkInfo(crqid)
          .then(response => {
            // console.log('getChangeWorkInfo: response...', response.json());
            if (!response.ok) {
              response.json().then(data => {
                // console.log('getChangeWorkInfo: response false data...', data);
                throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
              }).catch(error => {
                // console.log('getChangeWorkInfo: response false error...', error);
                if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
              });
            } else {
              return response.json().then(data => {
                // console.log('getChangeWorkInfo: data...', data);
                dispatch({ type: 'PROGRESS', payload: false });
                if (data.entries.length > 0) populateWorkInfo(data.entries);
              });
            }
          });
        getChangeImpactedAreas(crqid)
          .then(response => {
            // console.log('getChangeImpactedAreas: response...', response.json());
            if (!response.ok) {
              response.json().then(data => {
                // console.log('getChangeImpactedAreas: response false data...', data);
                throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
              }).catch(error => {
                // console.log('getChangeImpactedAreas: response false error...', error);
                if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
              });
            } else {
              return response.json().then(data => {
                // console.log('getChangeImpactedAreas: data...', data);
                if (data.entries.length > 0) populateImpactedAreas(data.entries);
              });
            }
          });
        getChangeAssociations(crqid)
          .then(response => {
            // console.log('getChangeAssociations: response...', response.json());
            if (!response.ok) {
              response.json().then(data => {
                // console.log('getChangeAssociations: response false data...', data);
                throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
              }).catch(error => {
                // console.log('getChangeAssociations: response false error...', error);
                if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
              });
            } else {
              return response.json().then(data => {
                // console.log('getChangeAssociations: data...', data);
                if (data.entries.length > 0) populateAssociations(data.entries);
              });
            }
          });
      }, 500);
    } else {
      setAssessed(true);
      setSnackState({ severity: 'info', message: 'Please login first', show: true, duration: 2000 });
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
      reason: data[0].values['Reason For Change'],
      impact: data[0].values['Impact'],
      risk: data[0].values['Risk Level'],
      scheduleStart: userDate(data[0].values['Scheduled Start Date'], true),
      scheduleEnd: userDate(data[0].values['Scheduled End Date'], true),
    });
  };

  const populateWorkInfo = (data) => {
    // console.log('populateWorkInfo: data', data);
    let list = [];
    data.map(v => {
      list.push({
        workLogType: v.values['Work Log Type'],
        detailedDescription: v.values['Detailed Description'],
        workLogSubmitter: v.values['Work Log Submitter'],
        workLogSubmitDate: userDate(v.values['Work Log Submit Date'], true),
      });
      return true;
    });
    setCrqWorkInfo(list);
  };

  const populateImpactedAreas = (data) => {
    // console.log('populateImpactedAreas: data', data);
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
    // console.log('populateImpactedAreas: data', data);
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

  const handleApproveButton = () => {
    setAssessed(true);
    setSnackState({ severity: 'info', message: 'Change was approved', show: true });
  };

  const handleRejectButton = () => {
    setAssessed(true);
    setSnackState({ severity: 'info', message: 'Change was rejected', show: true });
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
        {state.showProgress ? null : (
          <Box p={{ xs: 1, md: 3 }}>
            <StyledField label="Change Request Details" font="h6" />
            <Box mt={{ xs: 1, md: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><StyledField label="Change Number" value={crqData.changeId} font="" /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Status" value={crqData.status} font="" /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Coordinator" value={crqData.coordinator} font="" /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Description" value={crqData.description} font="" /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Service CI" value={crqData.serviceCI} font="" /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Change Reason" value={crqData.reason} font="" /></Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Impact" value={crqData.impact} font="" /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Risk Level" value={crqData.risk} font="" /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Start Date" value={crqData.scheduleStart} font="" /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="End Date" value={crqData.scheduleEnd} font="" /></Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Change Notes</Typography></AccordionSummary>
                  <AccordionDetails><Typography color="primary">{crqData.notes}</Typography></AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Work Info</Typography></AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small" aria-label="change request work info">
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Submitter</TableCell>
                            <TableCell>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {crqWorkInfo.map((v, i) => (
                            <TableRow key={i}>
                              <StyledTableCell>{v.workLogType}</StyledTableCell>
                              <StyledTableCell>{v.detailedDescription}</StyledTableCell>
                              <StyledTableCell>{v.workLogSubmitter}</StyledTableCell>
                              <StyledTableCell>{v.workLogSubmitDate}</StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Impacted Areas</Typography></AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small" aria-label="change request impacted areas">
                        <TableHead>
                          <TableRow>
                            <TableCell>Company</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {crqImpactedAreas.map((v, i) => (
                            <TableRow key={i}>
                              <StyledTableCell>{v.company}</StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Relationships</Typography></AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small" aria-label="change request relationships">
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {crqAssociations.map((v, i) => (
                            <TableRow key={i}>
                              <StyledTableCell>{v.requestType}</StyledTableCell>
                              <StyledTableCell>{v.requestDescription}</StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
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
      <Toolbar />
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

export default ApprovalCRQ;