import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

import StyledField from './StyledField';
import { RowHeader, RowTitle, RowContent } from './StyledTableCell';
import useStyles from './IncidentStyles';

const IncidentDetails = (props) => {
  const classes = useStyles();
  const { incData } = props;

  return (
    <Paper elevation={0}>
      <Box p={{ xs: 1, md: 3 }}>
        <StyledField label="Incident Details" />
        <Box mt={{ xs: 1, md: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><StyledField label="Incident Number" value={incData.incidentId} wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Submit Date" value={incData.submitDate} wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Description" value={incData.description} wrap={true} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Incident Type" value="User Service Restoration" wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Impact" value="4-Minor/Localized" wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Priority" value="4-Low" wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Assigned Group" value="Remedy Support" wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Status" value="Assigned" wrap={false} /></Grid>
          <Grid item xs={12}><Divider /></Grid>
          <Grid item xs={12}><StyledField label="User Details" /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Name" value={incData.firstName + ' ' + incData.lastName} wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Email" value={incData.email} wrap={false} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Phone" value={incData.phone} wrap={false} /></Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Notes</div></AccordionSummary>
              <AccordionDetails><div className={classes.notes}>{incData.notes}</div></AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Work Info</div></AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size='small' aria-label="incident work info">
                    <TableBody>
                      <TableRow>
                        <RowHeader>Type</RowHeader>
                        <RowHeader>Description</RowHeader>
                      </TableRow>
                      <TableRow>
                        <RowTitle>xxxxxxxx</RowTitle>
                        <RowContent>xxxxxx xxxxxx xxxxxx xxxxxx</RowContent>
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
        </Grid>
      </Box>
    </Paper>
  );
};

export default IncidentDetails;