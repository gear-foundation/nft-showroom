import { InfoCard, InfoCardProps } from '@/components';

import LandscapeSVG from '../../assets/landscape.svg?react';

type Props = Omit<InfoCardProps, 'heading' | 'text' | 'SVG'> & {
  // TODO: drop string
  heading: string | number | null;
  text: number;
};

function MintLimitInfoCard({ heading, text, ...props }: Props) {
  return (
    <InfoCard
      heading={heading ? `of ${heading} to be minted` : 'Unlimited series'}
      text={`${text} NFTs`}
      SVG={LandscapeSVG}
      {...props}
    />
  );
}

export { MintLimitInfoCard };
