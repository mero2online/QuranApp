import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store.jsx';
import { Provider } from 'react-redux';
import ThemeModeProvider from './theme/ThemeModeProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeModeProvider>
        <BrowserRouter basename='/quran'>
          <App />
        </BrowserRouter>
      </ThemeModeProvider>
    </Provider>
  </React.StrictMode>
);
