import { useState } from 'react';
import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppActions } from './useAppActions';

const ActionsDrawer = () => {
  const { actions } = useAppActions();
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <IconButton
        size='large'
        aria-label='Open menu'
        onClick={() => setOpen(true)}
        color='inherit'
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }} role='presentation'>
          <List>
            {actions.map((a) => (
              <ListItem key={a.key} disablePadding>
                <ListItemButton
                  disabled={a.disabled}
                  onClick={() => {
                    a.onClick();
                    setOpen(false);
                  }}
                >
                  <ListItemIcon>{a.icon}</ListItemIcon>
                  <ListItemText primary={a.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ActionsDrawer;
