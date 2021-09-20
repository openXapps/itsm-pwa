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
}));

export default useStyles;