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
// import { userDate } from '../../utilities/datetime';
import {
  getPeopleProfile,
  peopleProfileModel,
} from '../../service/PeopleService';
import { validateToken } from '../../service/RSSOService';
import PeopleDetails from '../Shared/PeopleDetails';
import useStyles from './PeopleStyles';

const PeopleView = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const { pplid } = useParams();
  const [pplData, setPllData] = useState(peopleProfileModel);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'X', show: false, duration: 3000 });

  useEffect(() => {
    validateToken(false).then(response => {
      if (response) {
        // console.log('PeopleView: effect handleDataLoad...');
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
    if (state.isAuth) {
      dispatch({ type: 'PROGRESS', payload: true });
      // Need a timeout if token is still fresh
      setTimeout(() => {
        getPeopleProfile(pplid)
          .then(response => {
            // console.log('getPeopleProfile: response...', response);
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getPeopleProfile: data...', data);
                if (data.entries.length === 1) populatePeople(data.entries);
                setSnackState({ severity: 'info', message: 'People profile fetched', show: true, duration: 3000 });
              });
            }
          }).catch(error => {
            // console.log('getPeopleProfile: error...', error);
            setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
          })

          // getChangeWorkInfo(pplid)
          //   .then(response => {
          //     // console.log('getChangeWorkInfo: response...', response);
          //     if (!response.ok) {
          //       if (response.status === 401) {
          //         dispatch({ type: 'AUTH', payload: false });
          //         throw new Error('Session expired');
          //       } else {
          //         throw new Error('ERR: ' + response.status + ' ' + response.statusText);
          //       }
          //     } else {
          //       return response.json().then(data => {
          //         // console.log('getChangeWorkInfo: data...', data);
          //         if (data.entries.length > 0) populateWorkInfo(data.entries);
          //       });
          //     }
          //   }).catch(error => console.log('getChangeWorkInfo: error...', error));

          // getChangeImpactedAreas(pplid)
          //   .then(response => {
          //     // console.log('getChangeImpactedAreas: response...', response);
          //     if (!response.ok) {
          //       if (response.status === 401) {
          //         dispatch({ type: 'AUTH', payload: false });
          //         throw new Error('Session expired');
          //       } else {
          //         throw new Error('ERR: ' + response.status + ' ' + response.statusText);
          //       }
          //     } else {
          //       return response.json().then(data => {
          //         // console.log('getChangeImpactedAreas: data...', data);
          //         if (data.entries.length > 0) populateImpactedAreas(data.entries);
          //       });
          //     }
          //   }).catch(error => console.log('getChangeImpactedAreas: error...', error));

          // getChangeAssociations(pplid)
          //   .then(response => {
          //     // console.log('getChangeAssociations: response...', response);
          //     if (!response.ok) {
          //       if (response.status === 401) {
          //         dispatch({ type: 'AUTH', payload: false });
          //         throw new Error('Session expired');
          //       } else {
          //         throw new Error('ERR: ' + response.status + ' ' + response.statusText);
          //       }
          //     } else {
          //       return response.json().then(data => {
          //         // console.log('getChangeAssociations: data...', data);
          //         if (data.entries.length > 0) populateAssociations(data.entries);
          //       });
          //     }
          //   }).catch(error => console.log('getChangeAssociations: error...', error))
          .finally(() => dispatch({ type: 'PROGRESS', payload: false }));
      }, 1000);
    } else {
      setSnackState({ severity: 'info', message: 'Session expired', show: true, duration: 3000 });
    }
  }

  const populatePeople = (data) => {
    // console.log('populatePeople: data...', data);
    setPllData({
      ...peopleProfileModel,
      firstName: data[0].values['First Name'],
      lastName: data[0].values['Last Name'],
      email: data[0].values['Remedy Login ID'],
      corporateId: data[0].values['Corporate ID'],
      jobTitle: data[0].values['JobTitle'],
      phoneNumber: data[0].values['Phone Number Business'],
      supportStaff: data[0].values['Support Staff'],
    });
    // ,,,,,,
  };

  // const populateWorkInfo = (data) => {
  //   // console.log('populateWorkInfo: data...', data);
  //   let list = [];
  //   data.map(v => {
  //     list.push({
  //       workLogType: v.values['Work Log Type'],
  //       detailedDescription: v.values['Detailed Description'],
  //       workLogSubmitter: v.values['Work Log Submitter'],
  //       workLogSubmitDate: userDate(v.values['Work Log Submit Date'], false),
  //     });
  //     return true;
  //   });
  //   setCrqWorkInfo(list);
  // };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <>
      <Container maxWidth="md">
        <Box my={{ xs: 2, md: 3 }} display="flex" flexWrap="nowrap" alignItems="center">
          <Box flexGrow={1}>
            <Typography className={classes.header} variant="h6">People Profile View</Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => history.goBack()}
            disabled={state.showProgress}
          >Back</Button>
        </Box>
        <PeopleDetails
          pplData={pplData}
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

export default PeopleView;