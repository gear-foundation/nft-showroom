import '@gear-js/vara-ui/dist/style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TagManager from 'react-gtm-module';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { App } from './App';
import { GTM_ID } from './consts';
import './index.scss';

if (GTM_ID) TagManager.initialize({ gtmId: GTM_ID });

const router = createBrowserRouter([{ path: '*', element: <App /> }]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
