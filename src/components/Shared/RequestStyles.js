import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  accordionSummary: {
    ...theme.typography.body1,
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
}));

export default useStyles;