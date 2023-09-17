import './App.css';
import { Routes, Route } from 'react-router-dom';
import QuranGUI from './QuranGUI';
import Home from './Home';
import All from './All';
import Ranges from './Ranges';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/all' element={<All />}></Route>
        <Route path='/ranges' element={<Ranges />}></Route>
        <Route path='/:PageNo' element={<QuranGUI />}></Route>
      </Routes>
    </>
  );
}

export default App;
