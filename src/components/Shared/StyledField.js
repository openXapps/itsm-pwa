import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  soloLabelRoot: {
    ...theme.typography.body1,
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
    fontWeight: theme.typography.fontWeightBold,
  },
  labelRoot: {
    ...theme.typography.body1,
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
  },
  valueRoot: {
    ...theme.typography.body1,
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
    color: theme.palette.primary.main,
  },
}));

const StyledField = (props) => {
  const classes = useStyles();
  const { label, value } = props;

  return (
    <Grid container spacing={1}>
      <Grid item xs={value ? 4 : 12}>
        <div className={value ? classes.labelRoot : classes.soloLabelRoot}>{label}</div>
      </Grid>
      {value ? (
        <Grid item xs={8}>
          <div className={classes.valueRoot}>{value}</div>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default StyledField;