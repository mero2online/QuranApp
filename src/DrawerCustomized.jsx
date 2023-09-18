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
import { getSuraNumberFromURL } from './Data';

const DrawerCustomized = ({ Data }) => {
  const [state, setState] = useState(false);
  const [openCollapse, setOpenCollapse] = useState({});
  const [suraIndex, setSuraIndex] = useState();
  const refs = useRef([]);

  useEffect(() => {
    let myColl = {};
    Data.forEach((element, idx) => {
      myColl[idx] = false;
    });
    setOpenCollapse(myColl);

    const SuraNumber = getSuraNumberFromURL(Data);
    setSuraIndex(SuraNumber[0].id);
  }, [Data]);

  useEffect(() => {
    if (state) {
      setTimeout(() => {
        refs.current[suraIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 1000);
    }
  }, [state, suraIndex]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState(open);
    const SuraNumber = getSuraNumberFromURL(Data);
    if (SuraNumber.length === 1) {
      setSuraIndex(SuraNumber[0].id);
    } else {
      setSuraIndex(SuraNumber[SuraNumber.length - 1].id);
    }
  };
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {Data.map((page, index) => {
          const activeIndexClass = suraIndex === index ? 'activeIndex' : '';
          return (
            <div key={index}>
              <Link
                to={page.suraUrl}
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
                    setSuraIndex(index);
                  }}
                >
                  <ListItemButton className={activeIndexClass}>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <LibraryBooksIcon />
                    </ListItemIcon>
                    <ListItemText primary={page.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Collapse in={openCollapse[index]} timeout='auto' unmountOnExit>
                <List>
                  {Data[index].pagesPerSuraData.map((s, idx) => (
                    <Link
                      key={idx}
                      to={s.pageUrl}
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon sx={{ color: 'white' }}>
                            <MenuBookIcon />
                          </ListItemIcon>
                          <ListItemText primary={s.name} />
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
};
export default DrawerCustomized;
