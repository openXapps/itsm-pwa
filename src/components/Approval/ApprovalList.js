import {
  useEffect,
  useState,
  useContext
} from 'react';
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
import { getLocalSession } from '../../utilities/localstorage';
import useStyles from './ApprovalStyles';

const ApprovalList = ({ history }) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(context);
  // const [isLoading, setIsLoading] = useState(false);
  const [approvals, setApprovals] = useState([]);
  const [snackState, setSnackState] = useState({ severity: 'success', message: 'X', show: false, duration: 3000 });

  useEffect(() => {
    handleReload();
    return () => true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReload = () => {
    // console.log('ApprovalList: state...', state);
    if (state.isAuth) {
      // setIsLoading(true);
      dispatch({ type: 'PROGRESS', payload: true });
      setTimeout(() => {
        getApprovals(getLocalSession().data.user)
          .then(response => {
            // console.log('ApprovalList: response...', response.json());
            if (!response.ok) {
              response.json().then(data => {
                // console.log('ApprovalList: response false data...', data);
                throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
              }).catch(error => {
                // console.log('ApprovalList: response false error...', error);
                // setIsLoading(false);
                dispatch({ type: 'PROGRESS', payload: false });
                if (error.message.indexOf('Authentication failed') > 0) dispatch({ type: 'AUTH', payload: false });
                setSnackState({ severity: 'error', message: error.message, show: true, duration: 2000 });
              });
            } else {
              return response.json().then(data => {
                // console.log('ApprovalList: approvals...', data);
                // setIsLoading(false);
                dispatch({ type: 'PROGRESS', payload: false });
                populateApprovals(data.entries);
                // setApprovals(data.entries);
                setSnackState({ severity: 'success', message: 'Approvals fetched', show: true, duration: 1000 });
              });
            }
          });
      }, 500);
    } else {
      setSnackState({ severity: 'info', message: 'Please login first', show: true, duration: 2000 });
    }
  }

  const populateApprovals = (data) => {
    // console.log('populateApprovals: data', data);
    let _approvals = [];
    data.forEach(v => {
      _approvals.push({
        requester: v.values['Requester'],
        application: v.values['Application'],
        signatureId: v.values['Signature ID'],
        sourceNumber: v.values['14516'],
        description: v.values['14506'],
        // createDate: v.values['Create-Date-Sig'],
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
        avatar = 'CRQ'
        break;
      case 'SRM:Request':
        avatar = 'REQ'
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
  }

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box mt={3} display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <Typography className={classes.header} variant="h5">My Approvals</Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={handleReload}
        >Reload</Button>
        <Button
          style={{ marginLeft: '8px' }}
          variant="outlined"
          onClick={() => history.goBack()}
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
                        <Typography style={{ fontSize: 14 }}>{v.avatar}</Typography>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={v.createDate + ': ' + v.requester}
                      secondary={v.sourceNumber + ': ' + v.description}
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
                <Typography variant="h6">Loading...</Typography>
              </Box>
            ) : (
              <Box mt={3}>
                <Typography variant="h6">No approvals found. Click Reload to get approvals.</Typography>
              </Box>
            )
          )}
        </List>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
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