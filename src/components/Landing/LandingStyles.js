import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body1.fontSize,
    },
  },
  image: {
    height: 96,
    [theme.breakpoints.down('xs')]: {
      height: 64,
    },
  },
  counters: {
    fontSize: 16,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  }
}));

export default useStyles;