import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
  },
  logo: {
    height: theme.spacing(5),
  },
  appVersion: {
    fontSize: 12,
  },
}));

export default useStyles;