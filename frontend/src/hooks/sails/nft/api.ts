import { useAlert, useProgram, useSendProgramTransaction } from '@gear-js/react-hooks';

import { useMarketplace } from '@/context';
import { SailsProgram } from '@/hooks/sails/nft';

export function useProgramInstance(programId?: `0x${string}`) {
  return useProgram({
    library: SailsProgram,
    id: programId,
  });
}

export function useSendApproveTransaction(programId: `0x${string}`) {
  const { data: program } = useProgramInstance(programId);
  return useSendProgramTransaction({
    program,
    serviceName: 'nft',
    functionName: 'approve',
  });
}

export function useSendTransferTransaction(programId: `0x${string}`) {
  const { data: program } = useProgramInstance(programId);
  return useSendProgramTransaction({
    program,
    serviceName: 'nft',
    functionName: 'transferFrom',
  });
}

export function useStartApproveTransaction(programId: `0x${string}`) {
  const { marketplace } = useMarketplace();
  const alert = useAlert();
  const marketplaceAddress = marketplace?.address as `0x${string}` | undefined;

  const { sendTransactionAsync: sendApproveTransaction, isPending: isPendingApprove } =
    useSendApproveTransaction(programId);

  const startApproveTransaction = async (tokenId: number | string | bigint) => {
    if (!marketplaceAddress) return;

    try {
      await sendApproveTransaction({ args: [marketplaceAddress, tokenId] });
    } catch (e) {
      console.log(e);
      alert.error(e instanceof Error ? e.message : String(e));
    }
  };

  return { startApproveTransaction, isPendingApprove };
}
