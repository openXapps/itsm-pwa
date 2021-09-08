import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

export const RowTitle = withStyles((theme) => ({
  body: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
  },
}))(TableCell);

export const RowContent = withStyles((theme) => ({
  body: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
    color: theme.palette.primary.main,
  },
}))(TableCell);