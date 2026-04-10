import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import jsonQuranData from './QuranData.json';

const Home = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jsonQuranData;
    return jsonQuranData.filter(
      (s) =>
        s.Sura_Name_ENG.toLowerCase().includes(q) ||
        s.Sura_Name_ARA.includes(q) ||
        String(s.Sura_No).includes(q)
    );
  }, [query]);

  return (
    <Container maxWidth='md' sx={{ py: 2 }}>
      <TextField
        fullWidth
        size='small'
        placeholder='Search sura by name or number...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={1.5}>
        {filtered.map((sura) => (
          <Grid item xs={12} key={sura.Sura_No}>
            <Card variant='outlined'>
              <CardActionArea
                component={Link}
                to={`/${sura.START_PAGE}`}
                sx={{
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  {sura.Sura_No}
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    noWrap
                  >
                    {sura.Sura_Name_ENG}
                  </Typography>
                </Box>
                <Typography
                  variant='subtitle1'
                  sx={{
                    fontWeight: 600,
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {sura.Sura_Name_ARA.trim()}
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ flexShrink: 0, ml: 1 }}
                >
                  p.{sura.START_PAGE}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Typography
          color='text.secondary'
          sx={{ textAlign: 'center', mt: 4 }}
        >
          No suras match &quot;{query}&quot;
        </Typography>
      )}
    </Container>
  );
};

export default Home;
