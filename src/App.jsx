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

  const renderOptions = (options) => {
    return (
      <select onChange={(e) => handelOnSelectionChange(e.target.value)}>
        {options.map((o, i) => {
          return (
            <option key={i} value={i}>
              {o.Sura_No}_-_{o.Sura_Name_ENG}_-_{o.Sura_Name_ARA}
            </option>
          );
        })}
      </select>
    );
  };

  const renderSubOptions = (options) => {
    if (options)
      return (
        <select onChange={(e) => handelOnSelectionChangeSub(e.target.value)}>
          {options.map((o, i) => {
            return (
              <option key={i} value={o}>
                {o}
              </option>
            );
          })}
        </select>
      );
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
      {renderOptions(data)}
      {renderSubOptions(subOptions)}
      <div>{count}</div>
      <PageSwiper pageIdx={count} ranges={subOptions}></PageSwiper>
    </>
  );
}

export default App;
