import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body1.fontSize,
    },
  },
  avatarREQ: {
    color: theme.palette.info.light,
    backgroundColor: theme.palette.grey.A400,
  },
  avatarCRQ: {
    color: theme.palette.warning.light,
    backgroundColor: theme.palette.grey.A400,
  },
  listItemPrimary: {
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
  listItemSecondary: {
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
}));

export default useStyles;