import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HomeIcon from '@mui/icons-material/Home';
import ViewListIcon from '@mui/icons-material/ViewList';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
import { useDispatch } from 'react-redux';
import { setBookmarksModalOpen } from './features/app/appSlice';
import { getSuraNumberFromURL } from './Data';
import { useThemeMode } from './theme/ThemeModeProvider';

const DrawerCustomized = ({ Data }) => {
  const dispatch = useDispatch();
  const { mode, toggleMode } = useThemeMode();
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
        <Link
          to='/'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link
          to='/ranges'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ViewListIcon />
              </ListItemIcon>
              <ListItemText primary='Ranges' />
            </ListItemButton>
          </ListItem>
        </Link>
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setBookmarksModalOpen(true));
              setState(false);
            }}
          >
            <ListItemIcon>
              <BookmarkIcon />
            </ListItemIcon>
            <ListItemText primary='Load Bookmark' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => {
              e.stopPropagation();
              toggleMode();
            }}
          >
            <ListItemIcon>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText
              primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        {Data.map((page, index) => {
          const activeIndexClass = suraIndex === index ? 'activeIndex' : '';
          return (
            <div key={index}>
              <Link
                to={page.suraUrl}
                style={{ textDecoration: 'none', color: 'inherit' }}
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
                    <ListItemIcon>
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
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
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
    <Box sx={{ display: 'inline-flex' }}>
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

      <Drawer anchor='left' open={state} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </Box>
  );
};
DrawerCustomized.propTypes = {
  Data: PropTypes.array.isRequired,
};
export default DrawerCustomized;
