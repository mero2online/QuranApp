import {
  Button,
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
        <Button className='MyBtn'>Home</Button>
      </Link>
      <List>
        {data.map((page, index) => (
          <div key={index}>
            <Link
              to={`/${page.at(0).Page_No}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon color='primary'>
                    <LibraryBooksIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Juz ${index + 1}`}
                    primaryTypographyProps={{ color: 'primary' }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider />
            <List>
              {page.map((p, idx) => (
                <div key={idx}>
                  <Link
                    to={`/${p.Page_No}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <Typography
                          sx={{ display: 'inline' }}
                          component='span'
                          variant='body2'
                          color='text.primary'
                        >
                          {String(p.Page_No).padStart(3, '0')}
                        </Typography>
                      }
                    >
                      <ListItemButton>
                        <ListItemIcon>
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
                              color='text.secondary'
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
