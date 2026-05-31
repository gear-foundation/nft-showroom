import { HexString } from '@gear-js/api';
import { useAccount, useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { Container } from '@/components';
import { ROUTE } from '@/consts';
import { useMarketplace } from '@/context';
import { useLoading } from '@/hooks';
import { useProgramInstance as useNFTProgram } from '@/hooks/sails/nft';
import { useSendCreateCollectionTransaction } from '@/hooks/sails/showroom/api.ts';

import {
  COLLECTION_TYPE_NAME,
  DEFAULT_NFTS_VALUES,
  DEFAULT_PARAMETERS_VALUES,
  DEFAULT_SUMMARY_VALUES,
  MAX,
  STEPS,
} from '../../consts';
import { NFT, NFTsValues, ParametersValues, SummaryValues } from '../../types';
import { getBytes, getFileChunks, uploadToIpfs } from '../../utils';
import { FullScreenModal } from '../full-screen-modal';
import { NFTForm } from '../nft-form';
import { ParametersForm } from '../parameters-form';
import { SummaryForm } from '../summary-form';

function CreateSimpleCollectionModal({ close }: Pick<ModalProps, 'close'>) {
  const [stepIndex, setStepIndex] = useState(0);
  const [summaryValues, setSummaryValues] = useState(DEFAULT_SUMMARY_VALUES);
  const [parametersValues, setParametersValues] = useState(DEFAULT_PARAMETERS_VALUES);

  const { account } = useAccount();
  const { getChainBalanceValue } = useBalanceFormat();
  const alert = useAlert();
  const navigate = useNavigate();

  const { marketplace } = useMarketplace();
  const { sendTransactionAsync: sendCreateCollection } = useSendCreateCollectionTransaction();
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const { data: nftProgram } = useNFTProgram();

  const nextStep = () => setStepIndex((prevIndex) => prevIndex + 1);
  const prevStep = () => setStepIndex((prevIndex) => prevIndex - 1);

  const handleSummarySubmit = (values: SummaryValues) => {
    setSummaryValues(values);
    nextStep();
  };

  const handleParametersSubmit = (values: ParametersValues) => {
    setParametersValues(values);
    nextStep();
  };

  const getNftsPayload = async (nfts: NFT[]) => {
    const images = nfts.map(({ file }) => file);
    const chunks = getFileChunks(images, getBytes(MAX.SIZE_MB.NFTS_CHUNK), MAX.FILES_PER_CHUNK);
    const urls: string[] = [];

    for (const chunk of chunks) {
      const result = await uploadToIpfs(chunk);
      urls.push(...result);
    }

    const getNftPayload = (url: string, index: number) => {
      const { limit } = nfts[index]; // order of requests is important

      const limit_copies = limit || null;
      const name = null;

      return [url, { limit_copies, name }];
    };

    return urls.map((cid, index) => getNftPayload(cid, index));
  };

  const getFormPayload = async (nfts: NFT[]) => {
    const collectionOwner = account?.decodedAddress;
    const { feePerUploadedFile } = marketplace?.config || {};

    const { cover, logo, name, description, telegram, medium, discord, url: externalUrl, x: xcom } = summaryValues;
    const {
      mintPermission,
      isTransferable,
      isSellable,
      isMetadataChangesAllowed,
      tags,
      royalty,
      mintLimit,
      mintPrice,
    } = parametersValues;

    if (!cover || !logo) throw new Error('Cover and logo are required');
    const [collectionBanner, collectionLogo] = await uploadToIpfs([cover, logo]);
    const additionalLinks = { telegram, medium, discord, externalUrl, xcom };

    const userMintLimit = mintLimit || null;
    const variableMeta = isMetadataChangesAllowed;
    const transferable = isTransferable ? '0' : null;
    const sellable = isSellable ? '0' : null;
    const paymentForMint = getChainBalanceValue(mintPrice).toFixed();

    const collectionTags = tags.map(({ value }) => value);

    const imgLinksAndData = await getNftsPayload(nfts);

    const permissionToMint = ['admin', 'custom'].includes(mintPermission.value)
      ? mintPermission.addresses.map(({ value }) => value as HexString)
      : null;

    const config = {
      name,
      description,
      collection_tags: collectionTags,
      collection_banner: collectionBanner,
      collection_logo: collectionLogo,
      user_mint_limit: userMintLimit,
      additional_links: additionalLinks,
      royalty: parseInt(royalty),
      payment_for_mint: parseInt(paymentForMint),
      transferable,
      sellable,
      variable_meta: variableMeta,
    };

    return { collectionOwner, config, imgLinksAndData, permissionToMint, feePerUploadedFile };
  };

  const getBytesPayload = (payload: Awaited<ReturnType<typeof getFormPayload>>): HexString => {
    if (!nftProgram) throw new Error('NFT Program is not initialized');

    const { collectionOwner, config, imgLinksAndData, permissionToMint } = payload;

    // Ensure collectionOwner is in the correct format (hex string)
    const formattedCollectionOwner = collectionOwner as HexString;

    // Create the payload structure that matches the collection's init function
    // According to IDL: New : (collection_owner: actor_id, config: Config, img_links_and_data: vec struct { str, ImageData }, permission_to_mint: opt vec actor_id)
    const collectionPayload = [formattedCollectionOwner, config, imgLinksAndData, permissionToMint];

    // Encode as ("New", payload) like in Rust
    const request = ['New', collectionPayload];

    // Use sails-js registry to properly encode the payload with the correct type structure
    const encoded = nftProgram.registry
      .createType('(String, ([u8;32], Config, Vec<(String, ImageData)>, Option<Vec<[u8;32]>>))', request)
      .toU8a();

    return `0x${Array.from(encoded)
      .map((byte: number) => byte.toString(16).padStart(2, '0'))
      .join('')}`;
  };

  const handleNFTsSubmit = async ({ nfts }: NFTsValues, fee: bigint) => {
    try {
      enableLoading();
      const formPayload = await getFormPayload(nfts);
      const bytesPayload = getBytesPayload(formPayload);

      const { response } = await sendCreateCollection({
        args: [COLLECTION_TYPE_NAME.SIMPLE, bytesPayload],
        value: fee,
      });
      // Wait for 1s before navigation to collection page
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const url = generatePath(ROUTE.COLLECTION, { id: response.collection_address });
      navigate(url);
      alert.success('Collection created');
    } catch (error) {
      console.error('Error creating collection:', error);
      alert.error(error instanceof Error ? error.message : String(error));
    } finally {
      disableLoading();
    }
  };

  const getForm = () => {
    switch (stepIndex) {
      case 0:
        return <SummaryForm defaultValues={summaryValues} onBack={close} onSubmit={handleSummarySubmit} />;
      case 1:
        return <ParametersForm defaultValues={parametersValues} onBack={prevStep} onSubmit={handleParametersSubmit} />;
      case 2:
        return (
          <NFTForm
            defaultValues={DEFAULT_NFTS_VALUES}
            onBack={prevStep}
            onSubmit={handleNFTsSubmit}
            isLoading={isLoading}
          />
        );

      default:
        return (
          <Container>
            <p>Unexpected error occurred.</p>
          </Container>
        );
    }
  };

  return (
    <FullScreenModal heading="Create Simple NFT Collection" steps={STEPS} stepIndex={stepIndex} close={close}>
      {getForm()}
    </FullScreenModal>
  );
}

export { CreateSimpleCollectionModal };
