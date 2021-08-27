import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  logo: {
    height: theme.spacing(5),
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
    },
  },
  title: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      marginLeft: theme.spacing(1),
    },
  },
  appVersion: {
    fontSize: 12,
  },
  // menuButton: {
  // marginLeft: theme.spacing(1),
  //   [theme.breakpoints.down('xs')]: {
  //     marginRight: theme.spacing(0),
  //   },
  // },
  // drawerSize: {
  //   width: 250,
  // },
}));

export default useStyles;