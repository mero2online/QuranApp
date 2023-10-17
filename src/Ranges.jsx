import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
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
              style={{ textDecoration: 'none', color: '#1290ca' }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: '#1290ca' }}>
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
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <Typography
                          sx={{ display: 'inline' }}
                          component='span'
                          variant='body2'
                          // color='text.primary'
                          color='white'
                        >
                          {String(p.Page_No).padStart(3, '0')}
                        </Typography>
                      }
                    >
                      <ListItemButton>
                        <ListItemIcon sx={{ color: 'white' }}>
                          <MenuBookIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Rub ${p.Rub} - ${
                            filterBySuraNo(p.Sura_No)[0].Sura_Name_ARA
                          }`}
                          secondary={
                            <Typography
                              sx={{ display: 'inline' }}
                              component='span'
                              variant='body2'
                              // color='text.primary'
                              color='white'
                            >
                              {p.Aya_Start}
                            </Typography>
                          }
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
