import jsonData from './QuranData.json';

export const loadData = () => JSON.parse(JSON.stringify(jsonData));

export const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

export const modifyUrl = (title, url) => {
  if (typeof window.history.pushState != 'undefined') {
    var obj = {
      Title: title,
      Url: url,
    };
    window.history.pushState(obj, obj.Title, obj.Url);
  }
};
