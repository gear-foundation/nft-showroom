import { AccountProvider as GearAccountProvider, ProviderProps } from '@gear-js/react-hooks';

function AccountProvider({ children }: ProviderProps) {
  return <GearAccountProvider appName="Vara NFT Showroom">{children}</GearAccountProvider>;
}

export { AccountProvider };
