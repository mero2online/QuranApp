import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import { filterBySuraNo, rangesData } from './Data';

const Ranges = () => {
  const data = rangesData();
  return (
    <div>
      <Link to='/'>
        <button>Home</button>
      </Link>
      <List>
        {data.map((page, index) => (
          <div key={index}>
            <Link
              to={`/${page.at(0).Page_No}`}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <LibraryBooksIcon />
                  </ListItemIcon>
                  <ListItemText primary={`Juz ${index + 1}`} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider />
            <List>
              {page.map((p, idx) => (
                <div key={idx}>
                  <Link
                    to={`/${p.Page_No}`}
                    style={{ textDecoration: 'none', color: 'white' }}
                  >
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon sx={{ color: 'white' }}>
                          <MenuBookIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Rub ${p.Rub} - ${
                            filterBySuraNo(p.Sura_No)[0].Sura_Name_ARA
                          }`}
                        />
                        <ListItemText
                          primary={`${p.Aya_Start}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                  <Divider />
                </div>
              ))}
            </List>
          </div>
        ))}
      </List>
    </div>
  );
};

export default Ranges;
