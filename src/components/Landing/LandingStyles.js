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
    // marginLeft: theme.spacing(2),
    // padding: theme.spacing(2),
    // border: '2px solid black',
    // borderRadius: '15px 50px 30px',
    fontSize: theme.typography.body1.fontSize,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  }
}));

export default useStyles;