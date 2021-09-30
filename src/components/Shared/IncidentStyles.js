import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  notes: {
    ...theme.typography.body1,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
  accordionSummary: {
    ...theme.typography.body1,
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
}));

export default useStyles;