import {
  // useEffect,
  useState,
  useContext
} from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { context } from '../../context/StoreProvider';
import { getApprovals } from '../../service/DataService';
import { getSession } from '../../utilities/localstorage';

// const data = [
//   { name: '123' },
//   { name: '456' }
// ];

const LandingComponent = () => {
  const [state,] = useContext(context);
  const [isLoading, setIsLoading] = useState(false);
  const [approvals, setApprovals] = useState([]);
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Approvals fetched',
    show: false
  });

  // useEffect(() => {
  //   return () => true;
  // }, [])

  const handleReload = () => {
    // console.log('LandingComponent: state...', state);
    if (state.isAuth) {
      setIsLoading(true);
      getApprovals(getSession().data.user)
        .then(response => {
          if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);
          return response.json();
        }).then(data => {
          console.log('LandingComponent: approvals...', data);
          setIsLoading(false);
          setApprovals(data.entries);
          setSnackState({ severity: 'success', message: 'Approvals fetched', show: true });
        }).catch(err => {
          console.log('LandingComponent: error...', err);
          setIsLoading(false);
          setSnackState({ severity: 'error', message: 'Approvals failed: ' + err, show: true });
        });
    } else {
      setSnackState({ severity: 'info', message: 'Please login first', show: true });
    }
  }

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h6">My Approvals</Typography>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleReload}
          >Reload</Button>
        </Grid>
      </Grid>
      <Box width="100%" mt={3}>
        <List disablePadding>
          {!isLoading ? (
            approvals.map((v, i) => {
              // console.log('v = ', v);
              return (
                <div key={i}>
                  <ListItem
                  // disableGutters
                  // button
                  // component="a"
                  // href={v.siteURL}
                  // target="_blank"
                  // rel="noopener"
                  // data-site-id={v.siteId}
                  // onClick={handleLastClicked}
                  ><ListItemText
                      // className={classes.bookmarkText}
                      primary={v.values['Signature ID'] + ': ' + v.values.Application}
                      // primary="abc"
                      // primaryTypographyProps={breakpointSM ? ({ variant: 'body1' }) : ({ variant: 'h5' })}
                      secondary={v.values.Requester}
                    /><ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                      // data-site-id={v.siteId}
                      // onClick={handleEdit}
                      ><MoreVertIcon /></IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </div>
              );
            })
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

export default LandingComponent;