import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadData, range } from './Data';
import { PageSwiper } from './PageSwiper';
import DrawerCustomized from './DrawerCustomized';
const data = loadData();

const QuranGUI = () => {
  let { SuraNo, PageNo } = useParams();
  const [count, setCount] = useState(0);
  const [subOptions, setSubOptions] = useState([1]);

  useEffect(() => {
    if (SuraNo && PageNo) {
      handelOnSelectionChange(SuraNo - 1);
      handelOnSelectionChangeSub(PageNo);
    }
  }, [SuraNo, PageNo]);

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
      <DrawerCustomized Data={data} pagesPerSura={subOptions} />
      <div>{count}</div>
      <PageSwiper
        pageIdx={count}
        ranges={subOptions}
        setCount={setCount}
      ></PageSwiper>
    </>
  );
};

export default QuranGUI;
