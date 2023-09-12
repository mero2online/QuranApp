import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadData, range, suraDataLinks } from './Data';
import { PageSwiper } from './PageSwiper';
import DrawerCustomized from './DrawerCustomized';
const data = loadData();
const d = suraDataLinks();

const QuranGUI = () => {
  let { SuraNo, PageNo } = useParams();
  const [count, setCount] = useState(0);
  const [currentSura, setCurrentSura] = useState(1);
  const [subOptions, setSubOptions] = useState([1]);

  useEffect(() => {
    if (SuraNo && PageNo) {
      handelOnSelectionChange(SuraNo - 1);
      handelOnSelectionChangeSub(PageNo);
    }
  }, [SuraNo, PageNo]);
  useEffect(() => {
    let pathName = String(window.location.pathname).split('/');
    setCurrentSura(Number(pathName[2]));
  }, [count]);

  const handelOnSelectionChange = (idx) => {
    const sura = data[idx];
    const pagesPerSura =
      sura.START_PAGE === sura.END_PAGE
        ? [sura.START_PAGE]
        : range(sura.START_PAGE, sura.END_PAGE);
    setSubOptions(pagesPerSura);
    setCount(sura.START_PAGE);
  };
  const handelOnSelectionChangeSub = (page) => {
    setCount(Number(page));
  };

  return (
    <>
      <Link to='/'>
        <button>Home</button>
      </Link>
      <DrawerCustomized Data={data} pagesPerSura={subOptions} />
      <div>
        <div>Current Page {count}</div>
        <Link to={d[currentSura - 2]?.suraUrl}>
          <button disabled={!d[currentSura - 2]}>
            Prev {d[currentSura - 2]?.name}
          </button>
        </Link>
        <Link to={d[currentSura - 1]?.suraUrl}>
          <button>Current {d[currentSura - 1]?.name}</button>
        </Link>
        <Link to={d[currentSura]?.suraUrl}>
          <button disabled={!d[currentSura]}>
            Next {d[currentSura]?.name}
          </button>
        </Link>
      </div>
      <PageSwiper
        pageIdx={count}
        ranges={subOptions}
        setCount={setCount}
      ></PageSwiper>
    </>
  );
};

export default QuranGUI;
