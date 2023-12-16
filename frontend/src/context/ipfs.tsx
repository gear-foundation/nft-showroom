import { IPFSHTTPClient, create } from 'kubo-rpc-client';
import { ReactNode, createContext, useContext, useRef } from 'react';

type Props = {
  children: ReactNode;
  url: string;
};

const IPFSContext = createContext({} as IPFSHTTPClient);
const { Provider } = IPFSContext;

function IPFSProvider({ children, url }: Props) {
  const ref = useRef(create({ url }));

  return <Provider value={ref.current}>{children}</Provider>;
}

const useIPFS = () => useContext(IPFSContext);

export { IPFSProvider, useIPFS };
