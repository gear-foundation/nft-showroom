import { useApi } from '@gear-js/react-hooks';

import VaraSVG from '@/assets/vara.svg?react';
import { InfoCard, Props } from '@/features/collections/components/info-card';

function PriceInfoCard({ text, ...props }: Omit<Props, 'SVG'>) {
  const { api } = useApi();
  const [unit] = api?.registry.chainTokens || ['Unit'];

  return <InfoCard SVG={VaraSVG} text={`${text} ${unit}`} {...props} />;
}

export { PriceInfoCard };
