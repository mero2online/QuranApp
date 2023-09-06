import jsonData from './QuranData.json';

export const loadData = () => JSON.parse(JSON.stringify(jsonData));
