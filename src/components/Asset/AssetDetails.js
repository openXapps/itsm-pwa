import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Toolbar from '@material-ui/core/Toolbar';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import TableCell from '@material-ui/core/TableCell';
// import TextField from '@material-ui/core/TextField';

import { context } from '../../context/StoreProvider';
import { userDate } from '../../utilities/datetime';
import { validateToken } from '../../service/RSSOService';
import { RowHeader, } from '../Shared/StyledTableCell';
import StyledField from '../Shared/StyledField';
import useStyles from './AssetStyles';
import {
  computerSystemModel,
  getComputerSystem,
  customFieldsModel,
  getCustomFields,
} from '../../service/AssetService';

const AssetDetails = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const { astid } = useParams();
  const [assetDetails, setAssetDetails] = useState(computerSystemModel);
  const [customFields, setCustomFields] = useState(customFieldsModel);
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
                if (data.entries.length === 1) populateAssetDetails(data.entries);
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
                if (data.entries.length === 1) populateCustomFields(data.entries);
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

  const populateAssetDetails = (data) => {
    // console.log('populateAssetDetails: data...', data);
    setAssetDetails({
      ...computerSystemModel,
      name: data[0].values['Name'],
      serial: data[0].values['Serial Number'],
      tag: data[0].values['Tag Number'] || 'no data',
      class: data[0].values['UserDisplayObjectName'],
      item: data[0].values['Item'],
      model: data[0].values['Model Number'],
      make: data[0].values['Manufacturer Name+'],
      status: data[0].values['AssetLifecycleStatus'],
      scanDate: userDate(data[0].values['LastScanDate'], false),
      costCenter: data[0].values['Cost Center'] || 'no data',
      hostName: data[0].values['DNS Host Name'] || 'no data',
      domainName: data[0].values['Domain'] || 'no data',
    });
  };

  // ,,,
  const populateCustomFields = (data) => {
    // console.log('populateCustomFields: data...', data);
    setCustomFields({
      ...customFields,
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
        <Box my={3} display="flex" flexWrap="nowrap" alignItems="center">
          <Box flexGrow={1}>
            <Typography className={classes.header} variant="h6">Bank Asset</Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => history.goBack()}
            disabled={state.showProgress}
          >Back</Button>
        </Box>
        <Paper elevation={0}>
          <Box p={{ xs: 1, md: 3 }}>
            <StyledField label={assetDetails.item + " Details"} />
            <Box mt={{ xs: 1, md: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><StyledField label="Name" value={assetDetails.hostName} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Domain" value={assetDetails.domainName} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Tag" value={assetDetails.tag} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Serial" value={assetDetails.serial} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Model" value={assetDetails.model} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Make" value={assetDetails.make} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Status" value={assetDetails.status} /></Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Cost Centre" value={assetDetails.costCenter} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Last Scanned" value={assetDetails.scanDate} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Last Used By" value={customFields.loginUser} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Used By Date" value={customFields.loginDate} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Verified By" value={customFields.verifyUser} /></Grid>
              <Grid item xs={12} sm={6}><StyledField label="Verified Date" value={customFields.verifyDate} /></Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Work Info</div></AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size='small' aria-label="asset work info">
                        <TableBody>
                          <TableRow>
                            <RowHeader>Type</RowHeader>
                            <RowHeader>Description</RowHeader>
                            {/* <RowHeader>Submitter</RowHeader>
                          <RowHeader>Date</RowHeader> */}
                          </TableRow>
                          {/* {crqWorkInfo.map((v, i) => (
                            <TableRow key={i} style={{ verticalAlign: 'top' }}>
                              <RowTitle>{v.workLogType}</RowTitle>
                              <RowContent>{v.detailedDescription}</RowContent>
                              <RowContent>{v.workLogSubmitter}</RowContent>
                            <RowContent>{v.workLogSubmitDate}</RowContent>
                            </TableRow>
                          ))} */}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Ownership</div></AccordionSummary>
                  <AccordionDetails></AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Relationships</div></AccordionSummary>
                  <AccordionDetails></AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        </Paper>
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

export default AssetDetails;