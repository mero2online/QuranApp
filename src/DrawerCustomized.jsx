import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {
  Drawer,
  Box,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const DrawerCustomized = ({ Data, pagesPerSura }) => {
  const [state, setState] = useState(false);
  const [openCollapse, setOpenCollapse] = useState({});
  const refs = useRef([]);
  let { SuraNo } = useParams();

  useEffect(() => {
    let myColl = {};
    Data.forEach((element, idx) => {
      myColl[idx] = false;
    });
    setOpenCollapse(myColl);
  }, [Data]);
  useEffect(() => {
    if (state) {
      setTimeout(() => {
        refs.current[SuraNo - 1]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 1000);
    }
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState(open);
  };
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      // onClick={toggleDrawer(false)}
      // onKeyDown={toggleDrawer(false)}
    >
      <List>
        {Data.map((page, index) => {
          const activeIndexClass =
            Number(SuraNo) - 1 === index ? 'activeIndex' : '';
          return (
            <div key={index}>
              <Link
                to={`/${page.Sura_No}/${page.START_PAGE}`}
                style={{ textDecoration: 'none', color: 'white' }}
                ref={(element) => {
                  refs.current[index] = element;
                }}
              >
                <ListItem
                  disablePadding
                  onClick={() => {
                    let myColl = {};
                    Data.forEach((element, idx) => {
                      if (idx === index) {
                        myColl[idx] = !openCollapse[index];
                      } else {
                        myColl[idx] = false;
                      }
                    });
                    setOpenCollapse(myColl);
                  }}
                >
                  <ListItemButton className={activeIndexClass}>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <LibraryBooksIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${page.Sura_No} - ${page.Sura_Name_ENG} - ${page.Sura_Name_ARA}`}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Collapse in={openCollapse[index]} timeout='auto' unmountOnExit>
                <List>
                  {pagesPerSura.map((s, idx) => (
                    <Link
                      key={idx}
                      to={`/${page.Sura_No}/${s}`}
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon sx={{ color: 'white' }}>
                            <MenuBookIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${page.Sura_No} - Page - ${s}`}
                          />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </Collapse>
              <Divider />
            </div>
          );
        })}
      </List>
    </Box>
  );
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        size='large'
        aria-label='account of current user'
        aria-controls='menu-appbar'
        aria-haspopup='true'
        onClick={toggleDrawer(true)}
        color='inherit'
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: 'primary.main',
          },
        }}
        anchor='left'
        open={state}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </Box>
  );
};
DrawerCustomized.propTypes = {
  Data: PropTypes.array.isRequired,
  pagesPerSura: PropTypes.array.isRequired,
};
export default DrawerCustomized;
