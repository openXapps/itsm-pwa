import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    },
  },
  avatarREQ: {
    color: theme.palette.warning.light,
    backgroundColor: theme.palette.primary.dark,
  },
  avatarCRQ: {
    color: theme.palette.warning.light,
    backgroundColor: theme.palette.success.dark,
  },
}));

export default useStyles;