import { Link } from 'react-router-dom';

import { ROUTE } from '@/consts';

import SVG from './logo.svg?react';

type Props = {
  large?: boolean;
};

function Logo({ large }: Props) {
  return (
    <Link to={ROUTE.HOME}>
      <SVG width={large ? 142 : 106} height={large ? 48 : 36} />
    </Link>
  );
}

export { Logo };
