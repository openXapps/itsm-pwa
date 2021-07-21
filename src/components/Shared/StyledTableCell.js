import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

const StyledTableCell = withStyles((theme) => ({
  body: {
    color: theme.palette.primary.main,
  },
}))(TableCell);

export default StyledTableCell;