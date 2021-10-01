import { useEffect, useState, useContext } from 'react';
// import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { context } from '../../context/StoreProvider';
import { validateToken } from '../../service/RSSOService';
import { getRequestList } from '../../service/RequestService';
import { userDate } from '../../utilities/datetime';
import useStyles from '../Shared/ListStyles';

const RequestList = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const [requests, setRequests] = useState([]);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'x', show: false, duration: 3000 });

  useEffect(() => {
    validateToken(false).then(response => {
      if (response) {
        // console.log('RequestList: effect handleReload...');
        handleReload();
      } else {
        dispatch({ type: 'AUTH', payload: false });
        setSnackState({ severity: 'error', message: 'Session expired', show: true, duration: 3000 });
      }
    });
    // Effect clean-up
    return () => true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReload = () => {
    if (requests.length > 0) setRequests([]);
    if (state.isAuth) {
      dispatch({ type: 'PROGRESS', payload: true });
      // Need a timeout if token is still fresh
      setTimeout(() => {
        getRequestList()
          .then(response => {
            // console.log('getRequestList: response...', response);
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getRequestList: requests...', data);
                populateRequests(data.entries);
                setSnackState({ severity: 'info', message: 'Requests fetched', show: true, duration: 3000 });
              });
            }
          }).catch(error => {
            // console.log('getRequestList: error...', error);
            setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
          }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
      }, 1000);
    } else {
      setSnackState({ severity: 'error', message: 'Session expired', show: true, duration: 3000 });
    }
  }

  const populateRequests = (data) => {
    let _requests = [];
    data.forEach(v => {
      _requests.push({
        requestId: v.values['Request Number'],
        summary: v.values['Summary'],
        submitDate: userDate(v.values['Submit Date'], false),
        status: v.values['Status']
      });
    });
    // console.log('populateRequests: _requests', _requests);
    setRequests(_requests);
  };

  const handleRequestDetailsButton = (e) => {
    const id = e.currentTarget.dataset.id;
    history.push('/request/' + id);
  }

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box my={{ xs: 2, md: 3 }} display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <Typography className={classes.header} variant="h6">My Requests</Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={handleReload}
          disabled={!state.isAuth || state.showProgress}
        >Reload</Button>
        <Button
          style={{ marginLeft: '8px' }}
          variant="outlined"
          onClick={() => history.goBack()}
          disabled={state.showProgress}
        >Back</Button>
      </Box>
      <Box width="100%">
        <List disablePadding>
          {requests.length > 0 ? (
            requests.map((v, i) => {
              return (
                <div key={i}>
                  <ListItem disableGutters>
                    <ListItemText
                      disableTypography
                      primary={<Typography className={classes.listItemPrimary}>{v.requestId + ': ' + v.submitDate}</Typography>}
                      secondary={
                        <>
                          <Typography className={classes.listItemSecondary}>{'Status: ' + v.status}</Typography>
                          <Typography className={classes.listItemSecondary}>{'Description: ' + v.summary}</Typography>
                        </>
                      }
                    /><ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        data-id={v.requestId}
                        onClick={handleRequestDetailsButton}
                      ><MoreVertIcon /></IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </div>
              );
            })
          ) : (
            state.showProgress ? (
              <Box mt={3}>
                <Typography variant="body1">Loading...</Typography>
              </Box>
            ) : (
              <Box mt={3}>
                <Typography variant="body1">No requests found. Click Reload to try again.</Typography>
              </Box>
            )
          )}
        </List>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
        open={snackState.show}
        autoHideDuration={snackState.duration}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}>
          {snackState.message}
        </Alert></Snackbar>
    </Container>
  );
};

export default RequestList;