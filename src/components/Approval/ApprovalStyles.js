import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
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