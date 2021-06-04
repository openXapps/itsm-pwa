import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginLeft: theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
    },
  },
  logo: {
    height: theme.spacing(5),
  },
  appVersion: {
    fontSize: 12,
  },
}));

export default useStyles;