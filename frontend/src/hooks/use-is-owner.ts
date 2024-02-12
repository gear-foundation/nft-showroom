import { useAccount } from '@gear-js/react-hooks';

function useIsOwner(owner: string) {
  const { account } = useAccount();

  return account?.decodedAddress === owner;
}

export { useIsOwner };
