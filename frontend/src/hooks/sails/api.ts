import { useProgram, useSendProgramTransaction } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

import { ADDRESS } from '@/consts.ts';
import { MARKETPLACE_QUERY } from '@/context/marketplace/consts.ts';
import { SailsProgram } from '@/hooks/sails/lib.ts';

export function useProgramInstance() {
  const { data } = useQuery({ queryKey: ['marketplace'], queryFn: () => request(ADDRESS.INDEXER, MARKETPLACE_QUERY) });
  const programId = (data?.marketplaceById?.address || ADDRESS.CONTRACT) as typeof ADDRESS.CONTRACT;

  return useProgram({
    library: SailsProgram,
    id: programId,
  });
}

export function useSendMintTransaction() {
  const { data: program } = useProgramInstance();
  return useSendProgramTransaction({
    program,
    serviceName: 'nftShowroom',
    functionName: 'mint',
  });
}

export function useSendSellTransaction() {
  const { data: program } = useProgramInstance();
  return useSendProgramTransaction({
    program,
    serviceName: 'nftShowroom',
    functionName: 'sell',
  });
}
