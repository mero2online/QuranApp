import './App.css';
import { Routes, Route } from 'react-router-dom';
import QuranGUI from './QuranGUI';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<div>Quran App</div>}></Route>
        <Route path='/:SuraNo/:PageNo' element={<QuranGUI />}></Route>
      </Routes>
    </>
  );
}

export default App;
