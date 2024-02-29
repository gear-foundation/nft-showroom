import { FilterButton, withAccount } from '@/components';

import { ACCOUNT_FILTER_VALUE } from '../../consts';
import { AccountFilterValue } from '../../types';

type Props = {
  value: AccountFilterValue;
  onChange: (value: AccountFilterValue) => void;
};

function Component({ value, onChange }: Props) {
  return (
    <div>
      <FilterButton
        text="All"
        isActive={value === ACCOUNT_FILTER_VALUE.ALL}
        onClick={() => onChange(ACCOUNT_FILTER_VALUE.ALL)}
      />

      <FilterButton
        text="My"
        isActive={value === ACCOUNT_FILTER_VALUE.MY}
        onClick={() => onChange(ACCOUNT_FILTER_VALUE.MY)}
      />
    </div>
  );
}

const AccountFilter = withAccount(Component);

export { AccountFilter };
