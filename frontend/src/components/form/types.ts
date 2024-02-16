import { InputProps as VaraInputProps } from '@gear-js/vara-ui';

type Props<T> = Omit<T, 'onChange' | 'onBlur'> & {
  name: string;
};

type InputProps = Props<VaraInputProps>;

export type { Props, InputProps };
