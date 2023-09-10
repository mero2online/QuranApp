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

import { loadData } from './Data';
const data = loadData();

const Home = () => {
  return (
    <div>
      <div>Quran App</div>
      <div>
        <Link to='/all'>All Pages</Link>
      </div>
      <div>
        <Link to='/ranges'>Ranges</Link>
      </div>
      <List>
        {data.map((page, index) => (
          <div key={index}>
            <Link
              to={`/${page.Sura_No}/${page.START_PAGE}`}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <LibraryBooksIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${page.Sura_No} - ${page.Sura_Name_ENG} - ${page.Sura_Name_ARA}`}
                  />
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
