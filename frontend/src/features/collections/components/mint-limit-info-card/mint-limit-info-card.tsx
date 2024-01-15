import LandscapeSVG from '../../assets/landscape.svg?react';
import { InfoCard, Props as InfoCardProps } from '../info-card';

type Props = Omit<InfoCardProps, 'heading' | 'text' | 'SVG'> & {
  heading: string | null;
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
