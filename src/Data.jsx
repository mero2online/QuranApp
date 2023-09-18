import jsonData from './QuranData.json';

export const loadData = () => JSON.parse(JSON.stringify(jsonData));

export const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

export const suraDataLinks = () => {
  const data = loadData();

  let final = [];
  data.forEach((page, idx) => {
    const pagesPerSura =
      page.START_PAGE === page.END_PAGE
        ? [page.START_PAGE]
        : range(page.START_PAGE, page.END_PAGE);
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
