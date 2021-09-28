import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
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
  progress: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    height: 48,
    width: 48,
  },
}));

export default useStyles;