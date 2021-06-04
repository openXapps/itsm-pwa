import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  avatar: {
    color: theme.palette.secondary.light,
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export default useStyles;