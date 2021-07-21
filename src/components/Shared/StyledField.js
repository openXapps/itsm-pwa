import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const StyledField = (props) => {
  const { label, value, font } = props;
  return (
    <Grid container spacing={1}>
      <Grid item xs={value ? 4 : 12}>
        <Typography variant={font || 'body1'}>{label}</Typography>
      </Grid>
      {value ? (
        <Grid item xs={8}>
          <Typography color="primary">{value}</Typography>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default StyledField;