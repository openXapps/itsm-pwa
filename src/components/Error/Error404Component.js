import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'

const Error404Component = ({ history }) => {
    return (
        <Container maxWidth="md">
            <Box mt={3} display="flex" flexWrap="nowrap" alignItems="center">
                <Box flexGrow={1}>
                    <Typography variant="h6">404 - Page not found</Typography>
                </Box>
                <Button
                    variant="outlined"
                    onClick={() => history.goBack()}
                >Back</Button>
            </Box>
        </Container>
    );
};

export default Error404Component;