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
  subscription CollectionQuery($id: String!) {
    collectionById(id: $id) {
      id
      name
      description
      collectionBanner
      collectionLogo
      admin
      tokensLimit
      userMintLimit
      paymentForMint
      transferable
      sellable

      nfts {
        id
        idInCollection
        name
        mediaUrl
        owner
        mintedBy

        sales(where: { status_eq: "open" }) {
          price
        }

        auctions(where: { status_eq: "open" }) {
          minPrice
          lastPrice
          endTimestamp
        }
      }

      type {
        id
      }

      additionalLinks {
        discord
        externalUrl
        medium
        xcom
        telegram
      }
    }
  }
`);

export { SOCIAL_ICON, COLLECTION_QUERY };
