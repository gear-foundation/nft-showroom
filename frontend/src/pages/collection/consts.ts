import DiscordSVG from '@/assets/discord.svg?react';
import MediumSVG from '@/assets/medium.svg?react';
import TelegramSVG from '@/assets/telegram.svg?react';
import TwitterSVG from '@/assets/twitter.svg?react';
import WebSVG from '@/assets/web.svg?react';
import { graphql } from '@/graphql';

const SOCIAL_ICON = {
  externalUrl: WebSVG,
  telegram: TelegramSVG,
  xcom: TwitterSVG,
  medium: MediumSVG,
  discord: DiscordSVG,
};

const COLLECTION_QUERY = graphql(`
  query CollectionQuery($id: String!) {
    collectionById(id: $id) {
      admin
      collectionBanner
      collectionLogo
      description
      id
      name
      tokensLimit
      paymentForMint
      nfts {
        id
        name
        collection {
          name
          id
        }
        mediaUrl
        idInCollection
        owner
      }
      type {
        id
      }
    }
  }
`);

export { SOCIAL_ICON, COLLECTION_QUERY };
