import jsonQuranData from './QuranData.json';
import jsonQuranPagesData from './QuranPagesData.json';

export const loadData = (json) => JSON.parse(JSON.stringify(json));

export const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

export const pagesData = (p) => {
  const data = loadData(jsonQuranPagesData);
  const pageData = data.filter((d) => {
    if (d.Page_No <= p) return d;
  });

  return pageData;
};

export const filterByJuz = (p) => {
  const data = loadData(jsonQuranPagesData);
  const juzData = data.filter((d) => {
    if (d.Juz === p) return d;
  });

  return juzData;
};

export const filterBySuraNo = (p) => {
  const data = loadData(jsonQuranData);
  const juzData = data.filter((d) => {
    if (d.Sura_No === p) return d;
  });

  return juzData;
};

export const rangesData = () => {
  let final = [];
  [...Array(30).keys()].forEach((j) => {
    const data = filterByJuz(j + 1);
    final.push(data);
  });

  return final;
};

export const suraDataLinks = () => {
  const data = loadData(jsonQuranData);

  let final = [];
  data.forEach((page, idx) => {
    // if (idx < data.length - 1)
    //   if (page.END_PAGE_MOD === data.at(idx + 1).START_PAGE_MOD)
    //     console.log(page.Sura_Name_ARA, page.END_PAGE_MOD);
    const pagesPerSura =
      page.START_PAGE_MOD === page.END_PAGE_MOD
        ? [page.START_PAGE_MOD]
        : range(page.START_PAGE_MOD, page.END_PAGE_MOD);
    let sData = [];
    pagesPerSura.forEach((s, i) => {
      sData.push({
        id: i,
        pageUrl: `/${s}`,
        name: `${page.Sura_No} - Page - ${s}`,
        pageNo: s,
      });
    });
    final.push({
      id: idx,
      suraUrl: `/${page.START_PAGE}`,
      name: `${page.Sura_No} - ${page.Sura_Name_ENG} - ${page.Sura_Name_ARA}`,
      pagesPerSuraData: sData,
      pagesPerSura: pagesPerSura,
      suraNo: page.Sura_No,
    });
  });

  return final;
};

export const chunks = (array, chunkSize) => {
  let chunks = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  return chunks;
};

export const modifyUrl = (title, url) => {
  if (typeof window.history.pushState != 'undefined') {
    var obj = {
      Title: title,
      Url: url,
    };
    window.history.pushState(obj, obj.Title, obj.Url);
  }
};

export const getSuraNumberFromURL = (Data) => {
  let pathName = String(window.location.pathname).split('/');
  let PageNo = pathName[pathName.length - 1];
  const SuraNumber = Data.filter((d) => {
    if (d.pagesPerSura.includes(Number(PageNo))) return d;
  });
  return SuraNumber;
};

export const getImageUrl = (name) => {
  return new URL(`./assets/${name}`, import.meta.url).href;
};
