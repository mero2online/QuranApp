import { useEffect, useState } from 'react';
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

const DrawerCustomized = ({
  Data,
  handelOnSelectionChange,
  handelOnSelectionChangeSub,
  pagesPerSura,
}) => {
  const [state, setState] = useState(false);
  const [openCollapse, setOpenCollapse] = useState({});

  useEffect(() => {
    let myColl = {};
    Data.forEach((element, idx) => {
      myColl[idx] = false;
    });
    setOpenCollapse(myColl);
  }, [Data]);

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
        {Data.map((page, index) => (
          <div key={index} style={{ textDecoration: 'none', color: 'white' }}>
            <ListItem
              disablePadding
              onClick={() => {
                handelOnSelectionChange(index);
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
              <ListItemButton>
                <ListItemIcon sx={{ color: 'white' }}>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${page.Sura_No} - ${page.Sura_Name_ENG} - ${page.Sura_Name_ARA}`}
                />
              </ListItemButton>
            </ListItem>
            <Collapse in={openCollapse[index]} timeout='auto' unmountOnExit>
              {pagesPerSura.map((s, idx) => (
                <ListItem
                  key={idx}
                  disablePadding
                  onClick={() => handelOnSelectionChangeSub(s)}
                >
                  <ListItemButton>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <MenuBookIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${page.Sura_No} - Page - ${s}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </Collapse>
            <Divider />
          </div>
        ))}
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
  handelOnSelectionChange: PropTypes.func.isRequired,
  handelOnSelectionChangeSub: PropTypes.func.isRequired,
  pagesPerSura: PropTypes.array.isRequired,
};
export default DrawerCustomized;
