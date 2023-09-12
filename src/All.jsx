import { Link } from 'react-router-dom';
import { range } from './Data';
import LoadImages from './LoadImages';

const All = () => {
  return (
    <div>
      <div>
        <Link to='/'>
          <button>Home</button>
        </Link>
      </div>
      <LoadImages RANGE={range(1, 604)} />
    </div>
  );
};

export default All;
