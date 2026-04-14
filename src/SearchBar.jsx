import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  setSearchError,
} from './features/app/appSlice';
import { loadDatabases, searchQuran } from './db/quranDb';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchQuery, isSearching } = useSelector((s) => s.app);
  const [localValue, setLocalValue] = useState(searchQuery || '');
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalValue(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const value = localValue.trim();
    if (!value) {
      dispatch(setSearchResults([]));
      dispatch(setSearchError(null));
      dispatch(setIsSearching(false));
      return;
    }
    debounceRef.current = setTimeout(async () => {
      dispatch(setIsSearching(true));
      dispatch(setSearchError(null));
      try {
        await loadDatabases();
        const results = searchQuran(value, 50);
        dispatch(setSearchResults(results));
      } catch (err) {
        console.error('Search failed:', err);
        dispatch(setSearchError(err?.message || 'Search failed'));
        dispatch(setSearchResults([]));
      } finally {
        dispatch(setIsSearching(false));
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localValue, dispatch]);

  const onChange = (e) => {
    const v = e.target.value;
    setLocalValue(v);
    dispatch(setSearchQuery(v));
  };

  const onClear = () => {
    setLocalValue('');
    dispatch(setSearchQuery(''));
    dispatch(setSearchResults([]));
  };

  return (
    <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
      <TextField
        fullWidth
        size='small'
        variant='outlined'
        placeholder='ابحث في القرآن...'
        value={localValue}
        onChange={onChange}
        dir='rtl'
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(255,255,255,0.6)',
            opacity: 1,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              {isSearching ? (
                <CircularProgress size={18} sx={{ color: 'white' }} />
              ) : (
                <SearchIcon sx={{ color: 'white' }} />
              )}
            </InputAdornment>
          ),
          endAdornment: localValue ? (
            <InputAdornment position='end'>
              <IconButton
                size='small'
                onClick={onClear}
                sx={{ color: 'white' }}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
};

export default SearchBar;
