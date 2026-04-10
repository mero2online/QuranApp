import './App.css';
import { Routes, Route } from 'react-router-dom';
import QuranGUI from './QuranGUI';
import Home from './Home';
import All from './All';
import Ranges from './Ranges';
import BookmarksModal from './BookmarksModal';
import CustomizedSnackBars from './CustomizedSnackBars';
import appData from '../package.json';

function App() {
  return (
    <>
      <div>
        {appData.displayName} v{appData.version}
      </div>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/all' element={<All />}></Route>
        <Route path='/ranges' element={<Ranges />}></Route>
        <Route path='/:PageNo' element={<QuranGUI />}></Route>
      </Routes>
      <BookmarksModal />
      <CustomizedSnackBars />
    </>
  );
}

export default App;
