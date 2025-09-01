import { Button, Radio, Input as VaraInput } from '@gear-js/vara-ui';
import { useCallback, useState } from 'react';

import { Identicon, TruncatedText } from '@/components';
import { cx, isValidAddress } from '@/utils';

import { Tag } from '../tag';

import styles from './mint-permission-form.module.scss';

type Props = {
  defaultValues: {
    value: 'any' | 'admin' | 'custom';
    addresses: { value: string }[];
  };
  onChange: (value: { value: 'any' | 'admin' | 'custom'; addresses: { value: string }[] }) => void;
  error: string | undefined;
};

function MintPermissionForm({ defaultValues, error, onChange }: Props) {
  const [selectedValue, setSelectedValue] = useState(defaultValues.value);
  const [addresses, setAddresses] = useState(defaultValues.addresses);
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string | undefined>();

  const handleValueChange = useCallback(
    (value: 'any' | 'admin' | 'custom') => {
      setSelectedValue(value);
      setAddress('');
      setAddressError(undefined);
      onChange({ value, addresses });
    },
    [addresses, onChange],
  );

  const handleAddAddress = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!address.trim()) {
        setAddressError('Address is required');
        return;
      }

      if (addresses.some((addr) => addr.value === address)) {
        setAddressError('Address already exists');
        return;
      }

      const newAddresses = [...addresses, { value: address }];
      setAddresses(newAddresses);
      setAddress('');
      setAddressError(undefined);
      onChange({ value: selectedValue, addresses: newAddresses });
    },
    [address, addresses, selectedValue, onChange],
  );

  const handleRemoveAddress = useCallback(
    (index: number) => {
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
      onChange({ value: selectedValue, addresses: newAddresses });
    },
    [addresses, selectedValue, onChange],
  );

  const renderAddresses = () =>
    addresses.map(({ value }, index) => {
      const handleRemoveClick = () => {
        handleRemoveAddress(index);
      };

      return (
        <Tag key={value} onRemoveClick={handleRemoveClick}>
          {isValidAddress(value) ? (
            <Identicon value={value} size={16} />
          ) : (
            <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ccc' }} />
          )}
          <TruncatedText value={value} />
        </Tag>
      );
    });

  return (
    <>
      <fieldset className={cx(styles.fieldset, error && styles.error)}>
        <legend className={styles.legend}>Who can mint</legend>
        <div className={styles.radios}>
          <Radio
            label="Everyone"
            value="any"
            checked={selectedValue === 'any'}
            onChange={() => handleValueChange('any')}
          />
          <Radio
            label="Admin only"
            value="admin"
            checked={selectedValue === 'admin'}
            onChange={() => handleValueChange('admin')}
          />
          <Radio
            label="Specify"
            value="custom"
            checked={selectedValue === 'custom'}
            onChange={() => handleValueChange('custom')}
          />
        </div>

        {selectedValue === 'custom' && (
          <form onSubmit={handleAddAddress} className={styles.addAddress}>
            <VaraInput
              label="Address"
              size="small"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={addressError}
              block
            />
            <Button text="Add" size="small" color="border" type="submit" className={styles.addButton} />
          </form>
        )}
        {Boolean(addresses.length) && <ul className={styles.addresses}>{renderAddresses()}</ul>}
      </fieldset>

      <p className={styles.errorMessage}>{error}</p>
    </>
  );
}

export { MintPermissionForm };
