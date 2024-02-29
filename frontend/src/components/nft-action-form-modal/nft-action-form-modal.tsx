import { useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Modal, ModalProps } from '@gear-js/vara-ui';
import { ReactNode } from 'react';
import { DefaultValues, FieldValues } from 'react-hook-form';
import { ZodType } from 'zod';

import { Nft, Collection, Auction } from '@/graphql/graphql';
import { getIpfsLink } from '@/utils';

import { Form } from '../form';
import { InfoCard } from '../info-card';
import { PriceInfoCard } from '../price-info-card';

import CalendarSVG from './calendar.svg?react';
import styles from './nft-action-form-modal.module.scss';

type Props<T extends FieldValues> = {
  modal: Pick<ModalProps, 'heading' | 'close'>;
  form: { defaultValues: DefaultValues<T>; onSubmit: (data: T) => void; schema: ZodType } & { isLoading: boolean };
  nft: Pick<Nft, 'name' | 'mediaUrl'>;
  collection: Pick<Collection, 'name'>;
  children: ReactNode;
  auction?: Pick<Auction, 'minPrice' | 'lastPrice' | 'endTimestamp'>;
};

function NFTActionFormModal<T extends FieldValues>({ modal, form, nft, collection, auction, children }: Props<T>) {
  const { heading, close } = modal;
  const { defaultValues, schema, isLoading, onSubmit } = form;

  const { getFormattedBalanceValue } = useBalanceFormat();

  return (
    <Modal heading={heading} close={close}>
      <div className={styles.nft}>
        <img src={getIpfsLink(nft.mediaUrl)} alt="" className={styles.image} />

        <div>
          <h4 className={styles.name}>{nft.name}</h4>
          <p className={styles.collectionName}>{collection.name}</p>
        </div>
      </div>

      {auction && (
        <div className={styles.auction}>
          <PriceInfoCard
            heading={auction.lastPrice ? 'Current bid' : 'Minimum bid'}
            text={getFormattedBalanceValue(auction.lastPrice || auction.minPrice).toFixed()}
          />

          <InfoCard
            SVG={CalendarSVG}
            heading="End date"
            // TODOINDEXER:
            text={new Date(auction.endTimestamp!).toLocaleString()}
          />
        </div>
      )}

      <Form defaultValues={defaultValues} onSubmit={onSubmit} className={styles.form} schema={schema}>
        {children}

        <div className={styles.buttons}>
          <Button text="Cancel" color="grey" onClick={close} />
          <Button type="submit" text="Submit" isLoading={isLoading} />
        </div>
      </Form>
    </Modal>
  );
}

export { NFTActionFormModal };
