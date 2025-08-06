import { useAccount, useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { Container } from '@/components';
import { ROUTE } from '@/consts';
import { useMarketplace } from '@/context';
import { useSendCreateCollectionTransaction } from '@/hooks/sails/showroom/api.ts';

import {
  COLLECTION_TYPE_NAME,
  DEFAULT_NFTS_VALUES,
  DEFAULT_PARAMETERS_VALUES,
  DEFAULT_SUMMARY_VALUES,
  MAX,
  STEPS,
} from '../../consts';
import { CreateCollectionReply, NFT, NFTsValues, ParametersValues, SummaryValues } from '../../types';
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

  const { marketplace, collectionsMetadata } = useMarketplace();
  const { sendTransactionAsync: sendCreateCollection, isPending } = useSendCreateCollectionTransaction();

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

      const limitCopies = limit || null;
      const autoChangingRules = null;

      return [url, { limitCopies, autoChangingRules }];
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
      ? mintPermission.addresses.map(({ value }) => value)
      : null;

    const config = {
      name,
      description,
      collectionBanner,
      collectionLogo,
      additionalLinks,
      userMintLimit,
      royalty,
      paymentForMint,
      variableMeta,
      transferable,
      sellable,
      collectionTags,
    };

    return { collectionOwner, config, imgLinksAndData, permissionToMint, feePerUploadedFile };
  };

  const getBytesPayload = (payload: Awaited<ReturnType<typeof getFormPayload>>) => {
    const collectionMetadata = collectionsMetadata?.[COLLECTION_TYPE_NAME.SIMPLE];
    if (!collectionMetadata) throw new Error('Collection metadata not found');

    const initTypeIndex = collectionMetadata.types.init.input;
    if (initTypeIndex == null) throw new Error('init.input type index not found in NFT metadata');

    const encoded = collectionMetadata.createType(initTypeIndex, payload).toU8a();

    return Array.from(encoded);
  };

  const handleNFTsSubmit = async ({ nfts }: NFTsValues, fee: bigint) => {
    try {
      const formPayload = await getFormPayload(nfts);
      const bytesPayload = getBytesPayload(formPayload);
      // const payload = { CreateCollection: { typeName: COLLECTION_TYPE_NAME.SIMPLE, payload: bytesPayload } };
      // const value = fee.toString();
      //
      // const onSuccess = ({ collectionCreated }: CreateCollectionReply) => {
      //   const id = collectionCreated.collectionAddress;
      //   const url = generatePath(ROUTE.COLLECTION, { id });
      //
      //   navigate(url);
      //   alert.success('Collection created');
      // };

      // const resData = await sendCreateCollection({ args: [COLLECTION_TYPE_NAME.SIMPLE, bytesPayload] });

      // console.log({ resData });
      // const url = generatePath(ROUTE.COLLECTION, { id: response.collectionCreated.collectionAddress });
      // navigate(url);
      alert.success('Collection created');

      // sendMessage({ payload, onSuccess, onFinally, value });
    } catch (error) {
      alert.error(error instanceof Error ? error.message : String(error));
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
            isLoading={isPending}
          />
        );

      default:
        return (
          <Container>
            <p>Unexpected error occured.</p>
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
