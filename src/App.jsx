import { useEffect, useState } from 'react';
import './App.css';
import { loadData, range } from './Data';
import { PageSwiper } from './PageSwiper';
import DrawerCustomized from './DrawerCustomized';
const data = loadData();
function App() {
  const [count, setCount] = useState(0);
  const [subOptions, setSubOptions] = useState([1]);

  useEffect(() => {
    setCount(1);
  }, []);

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
      <div>Quran App</div>
      <DrawerCustomized
        Data={data}
        handelOnSelectionChange={handelOnSelectionChange}
        handelOnSelectionChangeSub={handelOnSelectionChangeSub}
        pagesPerSura={subOptions}
      />
      <div>{count}</div>
      <PageSwiper pageIdx={count} ranges={subOptions}></PageSwiper>
    </>
  );
}

export default App;
