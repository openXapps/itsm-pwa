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
import { getChangeList } from '../../service/ChangeService';
import useStyles from '../Shared/ListStyles';
import { userDate } from '../../utilities/datetime';

const ChangetList = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const [changes, setChanges] = useState([]);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'x', show: false, duration: 3000 });

  useEffect(() => {
    validateToken(false).then(response => {
      if (response) {
        // console.log('ChangetList: effect handleReload...');
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
    if (changes.length > 0) setChanges([]);
    if (state.isAuth) {
      dispatch({ type: 'PROGRESS', payload: true });
      // Need a timeout if token is still fresh
      setTimeout(() => {
        getChangeList()
          .then(response => {
            // console.log('getChangeList: response...', response);
            if (!response.ok) {
              if (response.status === 401) {
                dispatch({ type: 'AUTH', payload: false });
                throw new Error('Session expired');
              } else {
                throw new Error('ERR: ' + response.status + ' ' + response.statusText);
              }
            } else {
              return response.json().then(data => {
                // console.log('getChangeList: changes...', data);
                populateChanges(data.entries);
                setSnackState({ severity: 'info', message: 'Changes fetched', show: true, duration: 3000 });
              });
            }
          }).catch(error => {
            // console.log('getChangeList: error...', error);
            setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
          }).finally(() => dispatch({ type: 'PROGRESS', payload: false }));
      }, 1000);
    } else {
      setSnackState({ severity: 'error', message: 'Session expired', show: true, duration: 3000 });
    }
  }

  const populateChanges = (data) => {
    let _changes = [];
    data.forEach(v => {
      _changes.push({
        changeId: v.values['Infrastructure Change ID'],
        description: v.values['Description'],
        status: v.values['Change Request Status'],
        created: userDate(v.values['Submit Date'], false),
      });
    });
    // console.log('populateChanges: _changes', _changes);
    setChanges(_changes);
  };

  const handleChangeDetailsButton = (e) => {
    const id = e.currentTarget.dataset.id;
    history.push('/change/' + id);
  }

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box my={{ xs: 2, md: 3 }} display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <Typography className={classes.header} variant="h6">My Changes</Typography>
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
          {changes.length > 0 ? (
            changes.map((v, i) => {
              return (
                <div key={i}>
                  <ListItem disableGutters>
                    <ListItemText
                      disableTypography
                      primary={<Typography className={classes.listItemPrimary}>{v.changeId + ': ' + v.status}</Typography>}
                      secondary={
                        <>
                          <Typography className={classes.listItemSecondary}>{'Created: ' + v.created}</Typography>
                          <Typography className={classes.listItemSecondary}>{'Description: ' + v.description}</Typography>
                        </>
                      }
                    /><ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        data-id={v.changeId}
                        onClick={handleChangeDetailsButton}
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
                <Typography variant="body1">No changes found. Click Reload to try again.</Typography>
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

export default ChangetList;