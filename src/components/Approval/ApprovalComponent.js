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
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import { context } from '../../context/StoreProvider';
import { getApprovals, approvalModel } from '../../service/DataService';
import { getLocalSession } from '../../utilities/localstorage';
import useStyles from './ApprovalStyles';

const ApprovalComponent = ({ history }) => {
  const classes = useStyles();
  const [state,] = useContext(context);
  const [isLoading, setIsLoading] = useState(false);
  const [approvals, setApprovals] = useState([approvalModel]);
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Approvals fetched',
    show: false
  });

  useEffect(() => {
    if (state.isAuth) handleReload();
    return () => true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isAuth])

  const handleReload = () => {
    // console.log('LandingComponent: state...', state);
    if (state.isAuth) {
      setIsLoading(true);
      getApprovals(getLocalSession().data.user)
        .then(response => {
          // console.log('LandingComponent: response...', response.json());
          if (!response.ok) {
            response.json().then(data => {
              // console.log('LandingComponent: response false data...', data);
              throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
            }).catch(err => {
              // console.log('LandingComponent: response false err...', err);
              setIsLoading(false);
              setSnackState({ severity: 'error', message: err.message, show: true });
            });
          } else {
            return response.json().then(data => {
              // console.log('LandingComponent: approvals...', data);
              setIsLoading(false);
              populateApprovals(data.entries);
              // setApprovals(data.entries);
              setSnackState({ severity: 'success', message: 'Approvals fetched', show: true });
            });
          }
        });
    } else {
      setSnackState({ severity: 'info', message: 'Please login first', show: true });
    }
  }

  const populateApprovals = (data) => {
    // console.log('populateApprovals: data', data);
    let _approvals = [];
    data.forEach(v => {
      _approvals.push({
        ...approvalModel,
        requester: v.values['Requester'],
        application: v.values['Application'],
        signatureId: v.values['Signature ID'],
        sourceNumber: v.values['14516'],
        description: v.values['14506'],
        createDate: v.values['Create-Date-Sig'],
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

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box mt={3} display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <Typography variant="h5">My Approvals</Typography>
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
      <Box width="100%" mt={5}>
        <List disablePadding>
          {!isLoading ? (
            approvals.length > 0 ? (
              approvals.map((v, i) => {
                // console.log('v = ', v);
                return (
                  <div key={i}>
                    <ListItem
                      disableGutters
                    // button
                    // component="a"
                    // href={v.siteURL}
                    // target="_blank"
                    // rel="noopener"
                    // data-site-id={v.siteId}
                    // onClick={handleLastClicked}
                    ><ListItemAvatar>
                        <Avatar className={clsx(classes['avatar' + v.avatar])}>
                          <Typography style={{ fontSize: 14 }}>{v.avatar}</Typography>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={v.requester}
                        // primaryTypographyProps={breakpointSM ? ({ variant: 'body1' }) : ({ variant: 'h5' })}
                        secondary={v.sourceNumber + ': ' + v.description}
                      /><ListItemSecondaryAction>
                        <IconButton
                        // edge="end"
                        // data-site-id={v.siteId}
                        // onClick={handleEdit}
                        ><ThumbUpIcon /></IconButton>
                        <IconButton
                        // edge="end"
                        // data-site-id={v.siteId}
                        // onClick={handleEdit}
                        ><ThumbDownIcon /></IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </div>
                );
              })
            ) : (
              <Box mt={5}>
                <Typography variant="h6">No approvals found. Click Reload to get approvals.</Typography>
              </Box>
            )
          ) : (
            <Box>Loading...</Box>
          )}
        </List>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackState.show}
        autoHideDuration={4000}
        onClose={handleSnackState}
      ><Alert elevation={6} onClose={handleSnackState} severity={snackState.severity}>
          {snackState.message}
        </Alert></Snackbar>
    </Container>
  );
};

export default ApprovalComponent;