import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBookmarksModalOpen } from './features/app/appSlice';

import { suraDataLinks } from './Data';
const data = suraDataLinks();

const Home = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <Link to='/all'>
        <Button className='MyBtn'>All Pages</Button>
      </Link>
      <Link to='/ranges'>
        <Button className='MyBtn'>Ranges</Button>
      </Link>
      <Button
        className='MyBtn'
        onClick={() => dispatch(setBookmarksModalOpen(true))}
      >
        Bookmarks
      </Button>
      <Link to={`/${localStorage.getItem('lastPage')}`}>
        <Button className='MyBtn'>LastPage</Button>
      </Link>
      <List>
        {data.map((page, index) => (
          <div key={index}>
            <Link
              to={page.suraUrl}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LibraryBooksIcon />
                  </ListItemIcon>
                  <ListItemText primary={page.name} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
};

export default Home;
