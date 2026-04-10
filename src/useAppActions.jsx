import HomeIcon from '@mui/icons-material/Home';
import ViewListIcon from '@mui/icons-material/ViewList';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBookmarksModalOpen } from './features/app/appSlice';
import { useThemeMode } from './theme/ThemeModeProvider';
import { useOfflineDownload } from './useOfflineDownload';

export const useAppActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();
  const {
    downloading,
    done,
    total,
    error: dlError,
    start: startDownload,
  } = useOfflineDownload();

  const onClickLast = () => {
    const last = localStorage.getItem('lastPage');
    if (last) navigate(`/${last}`);
  };

  const actions = [
    {
      key: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      onClick: () => navigate('/'),
    },
    {
      key: 'ranges',
      label: 'Ranges',
      icon: <ViewListIcon />,
      onClick: () => navigate('/ranges'),
    },
    {
      key: 'bookmarks',
      label: 'Bookmarks',
      icon: <BookmarkIcon />,
      onClick: () => dispatch(setBookmarksModalOpen(true)),
    },
    {
      key: 'last',
      label: 'Last Page',
      icon: <HistoryIcon />,
      onClick: onClickLast,
    },
    {
      key: 'download',
      label: downloading
        ? `Downloading ${done}/${total}`
        : dlError || 'Download All for Offline',
      icon: <CloudDownloadIcon />,
      onClick: startDownload,
      disabled: downloading,
    },
    {
      key: 'theme',
      label: mode === 'dark' ? 'Light Mode' : 'Dark Mode',
      icon: mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />,
      onClick: toggleMode,
    },
  ];

  return { actions, downloading, done, total };
};
