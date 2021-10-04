import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

import StyledField from './StyledField';
import { RowHeader, RowContent } from './StyledTableCell';
import useStyles from './PeopleStyles';

const PeopleDetails = (props) => {
  const classes = useStyles();
  const { pplData } = props;

  return (
    <Paper elevation={0}>
      <Box p={{ xs: 1, md: 3 }}>
        <StyledField label="People Profile Details" />
        <Box mt={{ xs: 1, md: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><StyledField label="First Name" value={pplData.firstName} wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Last Name" value={pplData.lastName} wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Job Title" value={pplData.jobTitle} wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Corporate ID" value={pplData.corporateId} wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Phone Number" value={pplData.phoneNumber} wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Email" value={pplData.email} wrap={false} /></Grid>
          {pplData.supportStaff === 'Yes' ? (
            <>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Support Groups</div></AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size='small' aria-label="people support groups">
                        <TableBody>
                          <TableRow>
                            <RowHeader>Company</RowHeader>
                            <RowHeader>Organization</RowHeader>
                            <RowHeader>Group</RowHeader>
                          </TableRow>
                          <TableRow>
                            <RowContent>Standard Bank of South Africa (Pty) Limited</RowContent>
                            <RowContent>CTO - IT Service Management</RowContent>
                            <RowContent>System Team</RowContent>
                          </TableRow>
                          {/* {crqWorkInfo.map((v, i) => (
                        <TableRow key={i} style={{ verticalAlign: 'top' }}>
                          <RowTitle>{v.workLogType}</RowTitle>
                          <RowContent>{v.detailedDescription}</RowContent>
                        </TableRow>
                      ))} */}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </>
          ) : (null)}
        </Grid>
      </Box>
    </Paper>
  );
};

export default PeopleDetails;