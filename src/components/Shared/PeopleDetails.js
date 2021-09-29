import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableRow from '@material-ui/core/TableRow';

import StyledField from './StyledField';
// import { RowHeader, RowTitle, RowContent } from './StyledTableCell';
// import useStyles from './PeopleStyles';

const PeopleDetails = (props) => {
  // const classes = useStyles();
  const { pplData } = props;

  return (
    <Paper elevation={0}>
      <Box p={{ xs: 1, md: 3 }}>
        <StyledField label="People Profile Details" />
        <Box mt={{ xs: 1, md: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><StyledField label="First Name" value={pplData.firstName} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Last Name" value={pplData.lastName} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Job Title" value={pplData.jobTitle} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Corporate ID" value={pplData.corporateId} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Phone Number" value={pplData.phoneNumber} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Email" value={pplData.email} /></Grid>
          <Grid item xs={12}><Divider /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Support Staff" value={pplData.supportStaff} /></Grid>
          {/* <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Change Notes</div></AccordionSummary>
              <AccordionDetails><div className={classes.notes}>{pplData.notes}</div></AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Impacted Areas</div></AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size='small' aria-label="change request impacted areas">
                    <TableBody>
                      <TableRow>
                        <RowHeader>Company</RowHeader>
                      </TableRow>
                      {crqImpactedAreas.map((v, i) => (
                        <TableRow key={i}>
                          <RowContent>{v.company}</RowContent>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Relationships</div></AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size='small' aria-label="change request relationships">
                    <TableBody>
                      <TableRow>
                        <RowHeader>Type</RowHeader>
                        <RowHeader>Description</RowHeader>
                      </TableRow>
                      {crqAssociations.map((v, i) => (
                        <TableRow key={i}>
                          <RowTitle>{v.requestType}</RowTitle>
                          <RowContent>{v.requestDescription}</RowContent>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Work Info</div></AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size='small' aria-label="change request work info">
                    <TableBody>
                      <TableRow>
                        <RowHeader>Type</RowHeader>
                        <RowHeader>Description</RowHeader>
                      </TableRow>
                      {crqWorkInfo.map((v, i) => (
                        <TableRow key={i} style={{ verticalAlign: 'top' }}>
                          <RowTitle>{v.workLogType}</RowTitle>
                          <RowContent>{v.detailedDescription}</RowContent>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid> */}
        </Grid>
      </Box>
    </Paper>
  );
};

export default PeopleDetails;