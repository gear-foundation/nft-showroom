import { useProgram, useSendProgramTransaction } from '@gear-js/react-hooks';

import { ADDRESS } from '@/consts';
import { SailsProgram } from '@/hooks-sails/lib.ts';

export function useProgramInstance() {
  return useProgram({
    library: SailsProgram,
    id: ADDRESS.CONTRACT,
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
