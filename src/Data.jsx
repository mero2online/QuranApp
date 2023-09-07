import jsonData from './QuranData.json';

export const loadData = () => JSON.parse(JSON.stringify(jsonData));

export const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
