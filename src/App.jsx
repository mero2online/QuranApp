import './App.css';
import { Routes, Route } from 'react-router-dom';
import QuranGUI from './QuranGUI';
import Home from './Home';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/:SuraNo/:PageNo' element={<QuranGUI />}></Route>
      </Routes>
    </>
  );
}

export default App;
