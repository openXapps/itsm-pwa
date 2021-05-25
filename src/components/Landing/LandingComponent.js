import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const LandingComponent = () => {
  return (
    <Container maxWidth="md">
      <Box mt={2}>
        <Typography variant="h6">Landing Page</Typography>
      </Box>
    </Container>
  );
};

export default LandingComponent;