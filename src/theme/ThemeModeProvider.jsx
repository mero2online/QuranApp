import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';

const ThemeModeContext = createContext({
  mode: 'dark',
  toggleMode: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

const getInitialMode = () => {
  const stored = localStorage.getItem('themeMode');
  if (stored === 'light' || stored === 'dark') return stored;
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  ) {
    return 'light';
  }
  return 'dark';
};

const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    document.documentElement.style.colorScheme = mode;
    // Paint html/body background immediately so iOS reload / overscroll
    // doesn't flash black before React mounts.
    const bg = mode === 'light' ? '#ffffff' : '#121212';
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    // Update the iOS/Android status-bar color too.
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = bg;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#1290aa',
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            'html, body': {
              backgroundColor: theme.palette.background.default,
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

ThemeModeProvider.propTypes = {
  children: PropTypes.node,
};

export default ThemeModeProvider;
