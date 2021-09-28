import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

import { RowHeader, RowTitle, RowContent } from './StyledTableCell';
import StyledField from './StyledField';
import useStyles from './RequestStyles';

const RequestDetails = (props) => {
  const classes = useStyles();
  const { reqData } = props;

  return (
    <Paper elevation={0}>
      <Box p={{ xs: 1, md: 3 }}>
        <StyledField label="Service Request Details" />
        <Box mt={{ xs: 1, md: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><StyledField label="Request Number" value={reqData.requestId} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Summary" value={reqData.summary} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Requester" value={reqData.firstName + ' ' + reqData.lastName} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Request Date" value={reqData.submitDate} /></Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Request Content</div></AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size='small' aria-label="service request content">
                    <TableBody>
                      <TableRow>
                        <RowHeader>Questions</RowHeader>
                        <RowHeader>Answers</RowHeader>
                      </TableRow>
                      {reqData.details.map((v, i) => (
                        v ? (
                          <TableRow key={i} style={{ verticalAlign: 'top' }}>
                            <RowTitle>{v.indexOf(':') > 0 ? (v.slice(0, v.indexOf(':'))) : ''}</RowTitle>
                            <RowContent>{v.slice(v.indexOf(':') + 1)}</RowContent>
                          </TableRow>
                        ) : null
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RequestDetails;