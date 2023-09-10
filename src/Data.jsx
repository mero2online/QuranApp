import jsonData from './QuranData.json';

export const loadData = () => JSON.parse(JSON.stringify(jsonData));

export const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

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
