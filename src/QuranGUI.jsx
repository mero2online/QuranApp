import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { range, suraDataLinks } from './Data';
import { PageSwiper } from './PageSwiper';
import DrawerCustomized from './DrawerCustomized';
const d = suraDataLinks();

const QuranGUI = () => {
  let { PageNo } = useParams();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (PageNo) {
      handelOnSelectionChangeSub(PageNo);
    }
  }, [PageNo]);

  const handelOnSelectionChangeSub = (page) => {
    setCount(Number(page));
  };

  return (
    <>
      <Link to='/'>
        <button>Home</button>
      </Link>
      <DrawerCustomized Data={d} />
      <div>
        <div>Current Page {count}</div>
      </div>
      <PageSwiper
        pageIdx={count}
        ranges={range(1, 604)}
        setCount={setCount}
      ></PageSwiper>
    </>
  );
};

export default QuranGUI;
