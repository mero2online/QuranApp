import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Link } from 'react-router-dom';

import { suraDataLinks } from './Data';
const data = suraDataLinks();

const Home = () => {
  return (
    <div>
      <div>Quran App</div>
      <Link to='/all'>
        <button>All Pages</button>
      </Link>
      <Link to='/ranges'>
        <button>Ranges</button>
      </Link>
      <Link to='/bookmarks'>
        <button>Bookmarks</button>
      </Link>
      <Link to={`/${localStorage.getItem('lastPage')}`}>
        <button>LastPage</button>
      </Link>
      <List>
        {data.map((page, index) => (
          <div key={index}>
            <Link
              to={page.suraUrl}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: 'white' }}>
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
