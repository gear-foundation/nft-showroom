import { useApi } from '@gear-js/react-hooks';

import VaraSVG from '@/assets/vara.svg?react';

import { InfoCard, InfoCardProps } from '../info-card';

function PriceInfoCard({ text, ...props }: Omit<InfoCardProps, 'SVG'>) {
  const { api } = useApi();
  const [unit] = api?.registry.chainTokens || ['Unit'];

  return <InfoCard SVG={VaraSVG} text={`${text} ${unit}`} {...props} />;
}

export { PriceInfoCard };
