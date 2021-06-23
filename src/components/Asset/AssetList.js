import {
  useEffect,
  useState,
  useContext,
  // Fragment,
} from 'react';
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
import { getAssets, assetModel } from '../../service/AssetService';
import { getLocalSession } from '../../utilities/localstorage';
import useStyles from './AssetStyles';

const AssetList = ({ history }) => {
  const classes = useStyles();
  const [state,] = useContext(context);
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState([assetModel]);
  const [snackState, setSnackState] = useState({
    severity: 'success',
    message: 'Assets fetched',
    show: false
  });

  useEffect(() => {
    if (state.isAuth) handleReload();
    return () => true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReload = () => {
    // console.log('AssetList: state...', state);
    if (state.isAuth) {
      setIsLoading(true);
      getAssets(getLocalSession().data.user)
        .then(response => {
          // console.log('AssetList: response...', response.json());
          if (!response.ok) {
            response.json().then(data => {
              // console.log('AssetList: response false data...', data);
              throw new Error(`${data[0].messageType}: ${data[0].messageText}: ${data[0].messageAppendedText}`);
            }).catch(err => {
              // console.log('AssetList: response false err...', err);
              setIsLoading(false);
              setSnackState({ severity: 'error', message: err.message, show: true });
            });
          } else {
            return response.json().then(data => {
              // console.log('AssetList: assets...', data);
              setIsLoading(false);
              populateAssets(data.entries);
              // setAssets(data.entries);
              setSnackState({ severity: 'success', message: 'Assets fetched', show: true });
            });
          }
        });
    } else {
      setSnackState({ severity: 'info', message: 'Please login first', show: true });
    }
  }

  const populateAssets = (data) => {
    let _assets = [];
    data.forEach(v => {
      _assets.push({
        ...assetModel,
        reconId: v.values['AssetInstanceId'],
        class: v.values['UserDisplayObjectName'],
        item: v.values['Item'],
        model: v.values['Model Number'],
        make: v.values['240001003'],
        serial: v.values['Serial Number'],
        name: v.values['Name'],
        status: v.values['AssetLifecycleStatus'],
      });
    });
    // console.log('populateAssets: _assets', _assets);
    setAssets(_assets);
  };

  const handleAssetDetailsButton = () => {

  }

  const handleSnackState = () => {
    setSnackState({ ...snackState, show: false });
  };

  return (
    <Container maxWidth="md">
      <Box mt={3} display="flex" flexWrap="nowrap" alignItems="center">
        <Box flexGrow={1}>
          <Typography className={classes.header} variant="h5">My Assets</Typography>
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
          {!isLoading ? (
            assets.length > 0 ? (
              assets.map((v, i) => {
                return (
                  <div key={i}>
                    <ListItem disableGutters>
                      <ListItemText
                        primary={v.model + ' ' + v.item}
                        secondary={'Serial: ' + v.serial}
                      /><ListItemSecondaryAction>
                        <IconButton edge="end"
                          onClick={handleAssetDetailsButton}
                        ><MoreVertIcon /></IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </div>
                );
              })
            ) : (
              <Box mt={3}>
                <Typography variant="h6">No assets found. Click Reload to get assets.</Typography>
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

export default AssetList;