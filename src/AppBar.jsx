import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  LinearProgress,
} from '@mui/material';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { useAppActions } from './useAppActions';
import ActionsDrawer from './ActionsDrawer';
import appData from '../package.json';

const AppBar = () => {
  const { pathname } = useLocation();
  const isPageView = matchPath('/:PageNo', pathname);
  const { actions, downloading, done, total } = useAppActions();

  return (
    <MuiAppBar position='static' color='primary' enableColorOnDark>
      <Toolbar
        variant='dense'
        sx={{ gap: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}
      >
        <Box
          sx={{
            flexGrow: 1,
            flexBasis: isPageView ? 'auto' : { xs: '100%', sm: 'auto' },
            textAlign: isPageView ? 'left' : { xs: 'center', sm: 'left' },
          }}
        >
          <Typography
            variant='h6'
            component={isPageView ? 'span' : Link}
            to={isPageView ? undefined : '/'}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontSize: '1rem',
              display: 'inline-block',
            }}
          >
            {appData.displayName}
            <Typography
              component='span'
              sx={{ ml: 1, fontSize: '0.75rem', opacity: 0.7 }}
            >
              v{appData.version}
            </Typography>
          </Typography>
        </Box>

        {isPageView ? (
          <ActionsDrawer />
        ) : (
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {actions.map((a) => (
              <Tooltip key={a.key} title={a.label}>
                <span>
                  <IconButton
                    color='inherit'
                    onClick={a.onClick}
                    disabled={a.disabled}
                  >
                    {a.icon}
                  </IconButton>
                </span>
              </Tooltip>
            ))}
          </Box>
        )}
      </Toolbar>
      {downloading && (
        <Box sx={{ px: 1, pb: 0.5 }}>
          <LinearProgress
            variant='determinate'
            value={total ? (done / total) * 100 : 0}
          />
        </Box>
      )}
    </MuiAppBar>
  );
};

export default AppBar;
