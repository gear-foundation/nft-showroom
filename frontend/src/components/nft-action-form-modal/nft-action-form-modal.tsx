import { useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Modal, ModalProps } from '@gear-js/vara-ui';
import { ReactNode } from 'react';
import { DefaultValues, FieldValues } from 'react-hook-form';
import { ZodType } from 'zod';

import { Nft, Collection } from '@/graphql/graphql';
import { getIpfsLink } from '@/utils';

import { Form } from '../form';
import { InfoCard } from '../info-card';
import { PriceInfoCard } from '../price-info-card';

import CalendarSVG from './calendar.svg?react';
import styles from './nft-action-form-modal.module.scss';

type Props<T> = {
  modal: Pick<ModalProps, 'heading' | 'close'>;
  form: { defaultValues: DefaultValues<T>; onSubmit: (data: T) => void; schema?: ZodType };
  nft: Pick<Nft, 'name' | 'mediaUrl'>;
  collection: Pick<Collection, 'name'>;
  children: ReactNode;
  auction?: { minBid: string; endDate: string };
};

function NFTActionFormModal<T extends FieldValues>({ modal, form, nft, collection, auction, children }: Props<T>) {
  const { heading, close } = modal;
  const { defaultValues, schema, onSubmit } = form;

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
          <PriceInfoCard heading="Minimal bid" text={getFormattedBalanceValue(auction.minBid).toFixed()} />
          <InfoCard SVG={CalendarSVG} heading="End date" text={auction.endDate} />
        </div>
      )}

      <Form defaultValues={defaultValues} onSubmit={onSubmit} className={styles.form} schema={schema}>
        {children}

        <div className={styles.buttons}>
          <Button text="Cancel" color="grey" onClick={close} />
          <Button type="submit" text="Submit" />
        </div>
      </Form>
    </Modal>
  );
}

export { NFTActionFormModal };
