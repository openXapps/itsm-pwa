import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

export const RowTitle = withStyles((theme) => ({
  body: {
    ...theme.typography.body1,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
}))(TableCell);

export const RowContent = withStyles((theme) => ({
  body: {
    ...theme.typography.body1,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
}))(TableCell);

export const RowHeader = withStyles((theme) => ({
  body: {
    ...theme.typography.body1,
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
}))(TableCell);