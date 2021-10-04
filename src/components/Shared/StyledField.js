import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    ...theme.typography.body1,
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
  label: {
    ...theme.typography.body1,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
  valueNoWrap: {
    ...theme.typography.body1,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  valueWrapped: {
    ...theme.typography.body1,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
}));

/**
 * Styled data field to display
 * @param {any} props Component props {label, value, wrap}
 * @returns React JSX component
 */
const StyledField = (props) => {
  const classes = useStyles();
  const { label, value, wrap } = props;

  return (
    <Grid container spacing={1}>
      <Grid item xs={value ? 4 : 12}>
        <div className={value ? classes.label : classes.title}>{label}</div>
      </Grid>
      {value ? (
        <Grid item xs={8}>
          <div className={wrap ? classes.valueWrapped : classes.valueNoWrap}>{value}</div>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default StyledField;