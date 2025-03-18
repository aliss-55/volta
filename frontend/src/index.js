import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalProvider } from './context/globalContext';
import { AuthContextProvider } from './context/authContext';
import { GlobalStyle } from './styles/GlobalStyle';
import { disableReactDevTools } from  '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') {   disableReactDevTools(); }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <AuthContextProvider>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

