import {
  // useEffect,
  // useState,
  useContext
} from 'react';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import { context } from '../../context/StoreProvider';
import useStyles from './LandingStyles';

const modules = [
  { name: 'My Approvals', img: './img/itsm-apr.png', path: '/approvals' },
  { name: 'My Incidents', img: './img/itsm-inc.jpg', path: '/incidents' },
  { name: 'My Assets', img: './img/itsm-ast.jpg', path: '/assets' },
];

const LandingComponent = ({ history }) => {
  const [state,] = useContext(context);
  const classes = useStyles();

  const handleGoToModule = () => {
    history.push(modules[0].path);
  }

  return (
    <Container maxWidth="md">
      {modules.map((v, i) => {
        return (
          <Box mt={3} key={i}>
            <Paper elevation={2}>
              <Box display="flex" p={{ xs: 1, md: 2 }} alignItems="center">
                <img src={v.img} alt={v.name} />
                <Typography className={classes.title} variant="h5">{v.name}</Typography>
                {state.isAuth ? (
                  <Button
                    edge="end"
                    onClick={handleGoToModule}
                  ><KeyboardArrowRightIcon /></Button>
                ) : (null)}
              </Box>
            </Paper>
          </Box>
        )
      })}
    </Container>
  );
};

export default LandingComponent;