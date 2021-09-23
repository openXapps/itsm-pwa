import { useEffect, useState, useContext } from 'react';
import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { context } from '../../context/StoreProvider';
import { userDate } from '../../utilities/datetime';
import { getApprovals } from '../../service/ApprovalService';
import { validateToken } from '../../service/RSSOService';
import { putARSettingsAction } from '../../service/SettingsService';
import useStyles from './ApprovalStyles';

const ApprovalList = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  const [approvals, setApprovals] = useState([]);
  const [snackState, setSnackState] = useState({ severity: 'info', message: 'X', show: false, duration: 3000 });

  useEffect(() => {
    validateToken(false).then(response => {
      if (response) {
        // console.log('ApprovalList: effect handleReload...');
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
    if (approvals.length > 0) setApprovals([]);
    if (state.isAuth) {
      dispatch({ type: 'PROGRESS', payload: true });
      // Need a timeout if token is still fresh
      setTimeout(() => {
        getApprovals().then(response => {
          // console.log('getApprovals: response...', response);
          if (!response.ok) {
            if (response.status === 401) {
              dispatch({ type: 'AUTH', payload: false });
              throw new Error('Session expired');
            } else {
              throw new Error('ERR: ' + response.status + ' ' + response.statusText);
            }
          }
          return response.json();
        }).then(data => {
          // console.log('getApprovals: approvals...', data);
          populateApprovals(data.entries);
          setSnackState({ severity: 'info', message: 'Approvals fetched', show: true, duration: 3000 });
        }).catch(error => {
          // console.log('getApprovals: error...', error);
          setSnackState({ severity: 'error', message: error.message, show: true, duration: 3000 });
        }).finally(() => {
          dispatch({ type: 'PROGRESS', payload: false });
          putARSettingsAction('SET_MODULE_COUNT').catch(error => console.log('putARSettingsAction: error...', error));
        });
      }, 1000);
    } else {
      setSnackState({ severity: 'error', message: 'Session expired', show: true, duration: 3000 });
    }
  };

  const populateApprovals = (data) => {
    // console.log('populateApprovals: data', data);
    let _approvals = [];
    let _description = '';
    data.forEach(v => {
      _description = v.values['14506'];
      if (_description.indexOf('CRQ0') > -1) _description = _description.slice(18);
      _approvals.push({
        requester: v.values['Requester'],
        application: v.values['Application'],
        signatureId: v.values['Signature ID'],
        sourceNumber: v.values['14516'],
        description: _description,
        createDate: userDate(v.values['Create-Date-Sig'], true),
        avatar: getAvatar(v.values['Application']),
      });
    });
    // console.log('populateApprovals: _approvals', _approvals);
    setApprovals(_approvals);
  };

  const getAvatar = (applicationName) => {
    let avatar = 'BOB';
    switch (applicationName) {
      case 'CHG:Infrastructure Change':
        avatar = 'CRQ';
        break;
      case 'SRM:Request':
        avatar = 'REQ';
        break;
      default:
        break;
    }
    return avatar;
  }

  const handleApprovalDetailsButton = (e) => {
    const id = e.currentTarget.dataset.id;
    const module = String(e.currentTarget.dataset.module).toLowerCase();
    history.push('/approval/' + module + '/' + id);
  };

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box mt={3} display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <Typography className={classes.header} variant="h6">My Approvals</Typography>
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
      <Box width="100%" mt={3}>
        <List disablePadding>
          {approvals.length > 0 ? (
            approvals.map((v, i) => {
              return (
                <div key={i}>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar className={clsx(classes['avatar' + v.avatar])}>
                        <Typography variant="body2">{v.avatar}</Typography>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      disableTypography
                      primary={<Typography className={classes.listItemPrimary}>{v.createDate + ': ' + v.requester}</Typography>}
                      secondary={<Typography className={classes.listItemSecondary}>{v.sourceNumber + ': ' + v.description}</Typography>}
                    /><ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        data-id={v.signatureId + '/' + v.sourceNumber}
                        data-module={v.avatar}
                        onClick={handleApprovalDetailsButton}
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
                <Typography variant="body1">No approvals found. Click Reload to try again.</Typography>
              </Box>
            )
          )}
        </List>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackState.show}
        autoHideDuration={snackState.duration}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}>
          {snackState.message}
        </Alert></Snackbar>
    </Container>
  );
};

export default ApprovalList;