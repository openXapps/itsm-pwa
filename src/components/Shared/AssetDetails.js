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

import { RowHeader, RowTitle, RowContent } from './StyledTableCell';
import StyledField from '../Shared/StyledField';
import useStyles from './AssetStyles';

const AssetDetails = (props) => {
  const classes = useStyles();
  const { astData, astCustomData } = props;

  return (
    <Paper elevation={0}>
      <Box p={{ xs: 1, md: 3 }}>
        <StyledField label={astData.item + " Details"} />
        <Box mt={{ xs: 1, md: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><StyledField label="Name" value={astData.name} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Status" value={astData.status} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Tag" value={astData.tag} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Serial" value={astData.serial} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Model" value={astData.model} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Make" value={astData.make} /></Grid>
          <Grid item xs={12}><Divider /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Cost Centre" value={astData.costCenter} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Last Scanned" value={astData.scanDate} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Last Used By" value={astCustomData.loginUser} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Used By Date" value={astCustomData.loginDate} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Verified By" value={astCustomData.verifyUser} /></Grid>
          <Grid item xs={12} sm={6}><StyledField label="Verified Date" value={astCustomData.verifyDate} /></Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Work Info</div></AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size='small' aria-label="asset work info">
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
                              <RowContent>{v.workLogSubmitter}</RowContent>
                            <RowContent>{v.workLogSubmitDate}</RowContent>
                            </TableRow>
                          ))} */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Ownership</div></AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size='small' aria-label="asset ownership">
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
                              <RowContent>{v.workLogSubmitter}</RowContent>
                            <RowContent>{v.workLogSubmitDate}</RowContent>
                            </TableRow>
                          ))} */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><div className={classes.accordionSummary}>Relationships</div></AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size='small' aria-label="asset relationships">
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
                              <RowContent>{v.workLogSubmitter}</RowContent>
                            <RowContent>{v.workLogSubmitDate}</RowContent>
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

export default AssetDetails;