import '@gear-js/vara-ui/dist/style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ROUTE } from './consts';
import { Collection, CreateCollection, Home, NFT } from './pages';
import { App } from './App';
import './index.scss';

const ROUTES = [
  { path: ROUTE.HOME, element: <Home /> },
  { path: ROUTE.CREATE_COLLECTION, element: <CreateCollection /> },
  { path: ROUTE.COLLECTION, element: <Collection /> },
  { path: ROUTE.NFT, element: <NFT /> },
];

const router = createBrowserRouter([{ element: <App />, children: ROUTES }]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
