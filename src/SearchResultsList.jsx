import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { setHighlightVerse } from './features/app/appSlice';
import { normalizeArabic } from './db/quranDb';
import quranData from './QuranData.json';

const buildSuraNameMap = () => {
  const map = new Map();
  quranData.forEach((s) => {
    map.set(s.Sura_No, `${s.Sura_No} - ${s.Sura_Name_ARA}`);
  });
  return map;
};

// Walk the display (tashkeel-preserving) text alongside its normalized form
// to find the slice of display characters that corresponds to the normalized
// match, so we can render the match with tashkeel intact.
const locateMatchInDisplay = (display, normalizedQuery) => {
  if (!display || !normalizedQuery) return null;
  const normDisplay = normalizeArabic(display);
  const idx = normDisplay.indexOf(normalizedQuery);
  if (idx === -1) return null;

  const endIdx = idx + normalizedQuery.length;
  let nPos = 0;
  let startDisplay = -1;
  let endDisplay = -1;

  for (let i = 0; i < display.length; i++) {
    const normChar = normalizeArabic(display[i]);
    const nextNPos = nPos + normChar.length;
    if (startDisplay === -1 && nextNPos > idx) startDisplay = i;
    if (endDisplay === -1 && nextNPos >= endIdx) {
      endDisplay = i + 1;
      break;
    }
    nPos = nextNPos;
  }
  if (startDisplay === -1) return null;
  if (endDisplay === -1) endDisplay = display.length;
  return { startDisplay, endDisplay };
};

const SearchResultsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchQuery, searchResults, isSearching, searchError } = useSelector(
    (s) => s.app
  );
  const suraNameMap = useMemo(buildSuraNameMap, []);
  const normalizedQuery = useMemo(
    () => normalizeArabic(String(searchQuery || '').trim()),
    [searchQuery]
  );

  if (!searchQuery || !searchQuery.trim()) return null;

  const onResultClick = (r) => {
    if (!r.pageNumber) return;
    dispatch(
      setHighlightVerse({
        sura: r.sura,
        ayah: r.ayah,
        pageNumber: r.pageNumber,
      })
    );
    navigate(`/${r.pageNumber}`);
  };

  const renderSnippet = (display) => {
    const loc = locateMatchInDisplay(display, normalizedQuery);
    if (!loc) return display;
    return (
      <>
        {display.slice(0, loc.startDisplay)}
        <mark style={{ backgroundColor: 'rgba(255,165,0,0.6)', color: 'inherit' }}>
          {display.slice(loc.startDisplay, loc.endDisplay)}
        </mark>
        {display.slice(loc.endDisplay)}
      </>
    );
  };

  return (
    <Paper
      elevation={4}
      sx={{
        mx: 1,
        maxHeight: '50vh',
        overflow: 'auto',
        backgroundColor: 'primary.main',
        color: 'white',
      }}
    >
      {searchError && (
        <Alert severity='error' sx={{ m: 1 }}>
          {searchError}
        </Alert>
      )}
      {!isSearching && !searchError && searchResults.length === 0 && (
        <Typography sx={{ p: 2, textAlign: 'center' }}>
          لا توجد نتائج
        </Typography>
      )}
      <List dense>
        {searchResults.map((r, i) => (
          <ListItem key={`${r.sura}:${r.ayah}:${i}`} disablePadding>
            <ListItemButton onClick={() => onResultClick(r)}>
              <ListItemText
                primary={
                  <Typography
                    component='div'
                    variant='body1'
                    dir='rtl'
                    sx={{ color: 'white' }}
                  >
                    {renderSnippet(r.text)}
                  </Typography>
                }
                secondary={
                  <Typography
                    component='div'
                    variant='caption'
                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {suraNameMap.get(r.sura) || `Sura ${r.sura}`} — آية{' '}
                    {r.ayah}
                    {r.pageNumber ? ` — صفحة ${r.pageNumber}` : ''}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SearchResultsList;
