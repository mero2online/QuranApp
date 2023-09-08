import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import QuranGUI from './QuranGUI';

function App() {
  return (
    <>
      <Link to={'/1/1'}>Go To Quran</Link>
      <Routes>
        <Route path='/' element={<div>Quran App</div>}></Route>
        <Route path='/:SuraNo/:PageNo' element={<QuranGUI />}></Route>
      </Routes>
    </>
  );
}

export default App;
