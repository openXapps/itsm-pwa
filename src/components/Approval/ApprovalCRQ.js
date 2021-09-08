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
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
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
import { postApproval } from '../../service/ApprovalService';
import { RowTitle, RowContent } from '../Shared/StyledTableCell';
import StyledField from '../Shared/StyledField';
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
      getChangeRequest(crqid)
        .then(response => {
          // console.log('ApprovalCRQ: response...', response.json());
          if (!response.ok) {
            response.json().then(data => {
              // console.log('getChangeRequest: response false data...', data);
              throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
            }).catch(error => {
              // console.log('getChangeRequest: response false error...', error);
              if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
              setSnackState({ severity: 'error', message: error.message, show: true, duration: 2000 });
            });
          } else {
            return response.json().then(data => {
              // console.log('getChangeRequest: data...', data);
              if (data.entries.length === 1) populateChange(data.entries);
              setAssessed(false);
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
        }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
    } else {
      setSnackState({ severity: 'info', message: 'Session expired', show: true, duration: 2000 });
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
        workLogSubmitDate: userDate(v.values['Work Log Submit Date'], false),
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
      const justificationNote = justification ? justification : 'Approved from PWA';
      const data = `{ "values": {
        "approvalAction": "${action}",
        "signatureId":   "${apid}",
        "applicationId": "${crqid}",
        "justification": "${justificationNote}"
      }}`;
      dispatch({ type: 'PROGRESS', payload: true });
      postApproval(data)
        .then(response => {
          if (!response.ok) {
            response.json().then(data => {
              throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
            }).catch(error => {
              if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
              setSnackState({ severity: 'error', message: error.message, show: true, duration: 2000 });
            });
          } else {
            response.json().then(data => {
              if (data.values.status === 'Success') {
                setSnackState({ severity: 'success', message: 'Change was ' + action, show: true, duration: 1000 });
              } else {
                setSnackState({ severity: 'error', message: 'Approval failed: ' + data.values.shortDescription, show: true, duration: 1000 });
              }
            }).catch(error => {
              console.log('handleApproveButton: data error...', error);
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
    <>
      <Container maxWidth="md" disableGutters>
        <Box mx={{ xs: 1, md: 3 }}>
          <Box py={2}>
            <Typography variant="h6">Change Request Approval</Typography>
          </Box>
          <Paper elevation={0}>
            <Box p={{ xs: 1, md: 3 }}>
              <StyledField label="Change Request Details" />
              <Box mt={{ xs: 1, md: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><StyledField label="Change Number" value={crqData.changeId} /></Grid>
                <Grid item xs={12} sm={6}><StyledField label="Status" value={crqData.status} /></Grid>
                <Grid item xs={12} sm={6}><StyledField label="Coordinator" value={crqData.coordinator} /></Grid>
                <Grid item xs={12} sm={6}><StyledField label="Description" value={crqData.description} /></Grid>
                <Grid item xs={12} sm={6}><StyledField label="Service CI" value={crqData.serviceCI} /></Grid>
                <Grid item xs={12} sm={6}><StyledField label="Change Reason" value={crqData.reason} /></Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12} sm={6}><StyledField label="Impact" value={crqData.impact} /></Grid>
                <Grid item xs={12} sm={6}><StyledField label="Risk Level" value={crqData.risk} /></Grid>
                <Grid item xs={12} sm={6}><StyledField label="Start Date" value={crqData.scheduleStart} /></Grid>
                <Grid item xs={12} sm={6}><StyledField label="End Date" value={crqData.scheduleEnd} /></Grid>
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Change Notes</div></AccordionSummary>
                    <AccordionDetails><div className={classes.notes}>{crqData.notes}</div></AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Impacted Areas</div></AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size='small' aria-label="change request impacted areas">
                          <TableHead>
                            <TableRow>
                              <TableCell>Company</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {crqImpactedAreas.map((v, i) => (
                              <TableRow key={i}>
                                <RowContent>{v.company}</RowContent>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Relationships</div></AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size='small' aria-label="change request relationships">
                          <TableHead>
                            <TableRow>
                              <TableCell>Type</TableCell>
                              <TableCell>Description</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {crqAssociations.map((v, i) => (
                              <TableRow key={i}>
                                <TableCell>{v.requestType}</TableCell>
                                <RowContent>{v.requestDescription}</RowContent>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Work Info</div></AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size='small' aria-label="change request work info">
                          <TableHead>
                            <TableRow>
                              <TableCell>Type</TableCell>
                              <TableCell>Description</TableCell>
                              {/* <TableCell>Submitter</TableCell>
                          <TableCell>Date</TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {crqWorkInfo.map((v, i) => (
                              <TableRow key={i} style={{ verticalAlign: 'top' }}>
                                <RowTitle>{v.workLogType}</RowTitle>
                                <RowContent>{v.detailedDescription}</RowContent>
                                {/* <RowContent>{v.workLogSubmitter}</RowContent>
                            <RowContent>{v.workLogSubmitDate}</RowContent> */}
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
          </Paper>
          <Box my={2}>
            <TextField
              label="Justification"
              placeholder="Approved from PWA"
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
        </Box>
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