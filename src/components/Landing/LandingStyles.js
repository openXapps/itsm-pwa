import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  image: {
    [theme.breakpoints.down('xs')]: {
      height: 80,
    },
  },
}));

export default useStyles;