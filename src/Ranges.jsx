import { ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

import { chunks, range } from './Data';
import { useState } from 'react';
import LoadImages from './LoadImages';

const Ranges = () => {
  const myRanges = chunks(range(1, 604), 20);
  const [rangeIndex, setRangeIndex] = useState(0);
  return (
    <div>
      <Link to='/'>Home</Link>
      <div>
        <button
        disabled={rangeIndex === myRanges.length-1}
          onClick={() => {
            setRangeIndex(rangeIndex + 1);
          }}
        >
          <ListItemButton>
            <ListItemText primary={`Next ${rangeIndex + 1}`} />
          </ListItemButton>
        </button>
        <button>{rangeIndex}</button>
        <button
          disabled={rangeIndex === 0}
          onClick={() => {
            setRangeIndex(rangeIndex - 1);
          }}
        >
          <ListItemButton>
            <ListItemText primary={`Prev ${rangeIndex - 1}`} />
          </ListItemButton>
        </button>
      </div>
      <LoadImages RANGE={myRanges[rangeIndex]} />
    </div>
  );
};

export default Ranges;
