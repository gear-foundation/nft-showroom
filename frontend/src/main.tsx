import '@gear-js/vara-ui/dist/style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TagManager from 'react-gtm-module';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { App } from './App';
import { PrivateRoute } from './components';
import { GTM_ID, ROUTE } from './consts';
import { Collection, CreateCollection, NFT, Lists, NotFound } from './pages';
import './index.scss';

if (GTM_ID) TagManager.initialize({ gtmId: GTM_ID });

const PRIVATE_ROUTES = [
  {
    path: ROUTE.CREATE_COLLECTION,
    element: <CreateCollection />,
  },
];

const ROUTES = [
  { path: '*', element: <NotFound /> },
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
