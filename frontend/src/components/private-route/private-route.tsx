import { useAccount } from '@gear-js/react-hooks';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTE } from '@/consts';

function PrivateRoute() {
  const { account } = useAccount();

  return account ? <Outlet /> : <Navigate to={ROUTE.HOME} replace />;
}

export { PrivateRoute };
