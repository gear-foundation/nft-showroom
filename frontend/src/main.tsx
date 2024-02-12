import '@gear-js/vara-ui/dist/style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { App } from './App';
import { PrivateRoute } from './components';
import { ROUTE } from './consts';
import { Collection, CreateCollection, NFT, Lists } from './pages';
import './index.scss';

const PRIVATE_ROUTES = [
  {
    path: ROUTE.CREATE_COLLECTION,
    element: <CreateCollection />,
  },
];

const ROUTES = [
  { path: ROUTE.COLLECTION, element: <Collection /> },
  { path: ROUTE.NFT, element: <NFT /> },

  { path: ROUTE.HOME, element: <Lists /> },
  { path: ROUTE.NFTS, element: <Lists /> },

  {
    element: <PrivateRoute />,
    children: PRIVATE_ROUTES,
  },
];

const router = createBrowserRouter([{ element: <App />, children: ROUTES }]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
