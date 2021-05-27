import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginLeft: theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
  },
  logo: {
    height: theme.spacing(5),
  }
}));

export default useStyles;