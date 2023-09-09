import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Link } from 'react-router-dom';

import { loadData, range } from './Data';
import { useState } from 'react';
import LoadImages from './LoadImages';
const data = loadData();

const Home = () => {
  const [IMAGES, setIMAGES] = useState([]);

  return (
    <div>
      <div>Quran App</div>
      <button
        onClick={() => {
          let images = [];
          range(1, 604).forEach((element) => {
            const pageNo = String(element).padStart(3, '0');
            images.push({
              id: element,
              pageNo: pageNo,
              url: `/quran/imgs/jpg/page${pageNo}.jpg`,
            });
          });
          setIMAGES(images);
        }}
      >
        Get All Images
      </button>
      {IMAGES.length > 0 && <LoadImages IMAGES={IMAGES} />}
      <List>
        {data.map((page, index) => (
          <div key={index}>
            <Link
              to={`/${page.Sura_No}/${page.START_PAGE}`}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <LibraryBooksIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${page.Sura_No} - ${page.Sura_Name_ENG} - ${page.Sura_Name_ARA}`}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
};

export default Home;
