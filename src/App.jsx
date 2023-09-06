import { useEffect, useState } from 'react';
import './App.css';
import { loadData } from './Data';
import { PageSwiper } from './PageSwiper';
const data = loadData();
function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const [subOptions, setSubOptions] = useState([1]);

  useEffect(() => {
    getImg(1);
    setCount(1);
  }, []);

  const getImg = async (id) => {
    setLoading(true);
    const pageNo = String(id).padStart(3, '0');
    const img = await fetch(
      // `https://archive.org/download/mtmha_pages_AutoCorrected/page${pageNo}.png`
      `./imgs/page${pageNo}.png`
    );
    setImgSrc(img.url);
    setLoading(false);
  };

  const range = (start, end) =>
    Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);

  const handelOnSelectionChange = (idx) => {
    const sura = data[idx];
    const pagesPerSura =
      sura.START_PAGE === sura.END_PAGE
        ? [sura.START_PAGE]
        : range(sura.START_PAGE, sura.END_PAGE);
    setSubOptions(pagesPerSura);
    setCount(sura.START_PAGE);
    getImg(sura.START_PAGE);
  };
  const handelOnSelectionChangeSub = (page) => {
    setCount(Number(page));
    getImg(Number(page));
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
  const renderImage = () => {
    if (!imgSrc) return <div></div>;
    if (loading) return <div>Loading</div>;
    return (
      <div>
        <img src={imgSrc} alt='img' className='img' />
      </div>
    );
  };

  return (
    <>
      <div>Quran App</div>
      {renderOptions(data)}
      {renderSubOptions(subOptions)}
      <div>
        <button
          className='MyBtn'
          onClick={() => {
            setCount(count + 1);
            getImg(count + 1);
          }}
          disabled={count >= 604 ? true : false}
        >
          Next
        </button>
        <span>{count}</span>
        <button
          className='MyBtn'
          onClick={() => {
            setCount(count - 1);
            getImg(count - 1);
          }}
          disabled={count <= 1 ? true : false}
        >
          Prev
        </button>
        <input
          className='MyBtn'
          type='number'
          onChange={(e) => {
            setImgSrc(null);
            setCount(Number(e.target.value));
          }}
          min={1}
          max={604}
        />
        <button
          className='MyBtn'
          onClick={() => {
            getImg(count);
          }}
          disabled={count <= 1 || count >= 605 ? true : false}
        >
          Go
        </button>
        {renderImage()}
      </div>
      <PageSwiper></PageSwiper>
    </>
  );
}

export default App;
