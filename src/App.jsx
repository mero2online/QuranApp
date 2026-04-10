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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
        }}
      >
        <div style={{ flexShrink: 0 }}>
          {appData.displayName} v{appData.version}
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/all' element={<All />}></Route>
            <Route path='/ranges' element={<Ranges />}></Route>
            <Route path='/:PageNo' element={<QuranGUI />}></Route>
          </Routes>
        </div>
      </div>
      <BookmarksModal />
      <CustomizedSnackBars />
    </>
  );
}

export default App;
