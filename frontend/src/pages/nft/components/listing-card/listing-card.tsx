import { useBalanceFormat } from '@gear-js/react-hooks';
import { ReactNode } from 'react';

import { PriceInfoCard } from '@/components';
import { SVGComponent } from '@/types';

import styles from './listing-card.module.scss';

type Props = {
  SVG: SVGComponent;
  heading: string;
  price: string;
  priceHeading: string;
  children: ReactNode;
};

function ListingCard({ SVG, heading, price, priceHeading, children }: Props) {
  const { getFormattedBalanceValue } = useBalanceFormat();

  return (
    <div className={styles.listing}>
      <p className={styles.heading}>
        <SVG /> {heading}
      </p>

      <div className={styles.card}>
        <PriceInfoCard heading={priceHeading} text={getFormattedBalanceValue(price).toFixed()} size="large" />

        {children}
      </div>
    </div>
  );
}

export { ListingCard };
