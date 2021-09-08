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
  notes: {
    ...theme.typography.body1,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
    color: theme.palette.primary.main,
  },
  accordionSummary: {
    ...theme.typography.body1,
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
    fontWeight: theme.typography.fontWeightBold,
  },
  accordionDetails: {
    padding: 0,
  },
}));

export default useStyles;