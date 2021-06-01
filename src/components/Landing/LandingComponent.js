import { useContext } from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { context } from '../../context/StoreProvider';

const data = [
  { name: '123' },
  { name: '456' }
];

const LandingComponent = () => {
  const [state, dispatch] = useContext(context);

  return (
    <Container>
      <Typography variant="h6">Landing Page</Typography>
      <Box width="100%" pl={{ sm: 1 }}>
        <List disablePadding>
          {true ? (
            data.map((v, i) => {
              return (
                <div key={i}>
                  <ListItem
                  // disableGutters
                  // button
                  // component="a"
                  // href={v.siteURL}
                  // target="_blank"
                  // rel="noopener"
                  // data-site-id={v.siteId}
                  // onClick={handleLastClicked}
                  ><ListItemText
                      // className={classes.bookmarkText}
                      primary={v.name}
                    // primaryTypographyProps={breakpointSM ? ({ variant: 'body1' }) : ({ variant: 'h5' })}
                    // secondary={v.category ? v.category : null}
                    /><ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                      // data-site-id={v.siteId}
                      // onClick={handleEdit}
                      ><MoreVertIcon /></IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </div>
              );
            })
          ) : (null)}
        </List>
      </Box>
    </Container>
  );
};

export default LandingComponent;