import { useAccount, useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { Container } from '@/components';
import { ROUTE } from '@/consts';
import { useIPFS, useMetadata } from '@/context';
import { useLoading, useMarketplaceMessage } from '@/hooks';

import {
  COLLECTION_NAME,
  DEFAULT_NFTS_VALUES,
  DEFAULT_PARAMETERS_VALUES,
  DEFAULT_SUMMARY_VALUES,
  STEPS,
} from '../../consts';
import { CreateCollectionReply, NFT, NFTsValues, ParametersValues, SummaryValues } from '../../types';
import { FullScreenModal } from '../full-screen-modal';
import { NFTForm } from '../nft-form';
import { ParametersForm } from '../parameters-form';
import { SummaryForm } from '../summary-form';

// TODO: get collection type metadata
const SIMPLE_COLLECTION_ID = '0x45c6b76956d38a14530a755ed6ca5b5f143d47f7a7d011b17cee740fe42c8f45';

function CreateSimpleCollectionModal({ close }: Pick<ModalProps, 'close'>) {
  const [stepIndex, setStepIndex] = useState(0);
  const [summaryValues, setSummaryValues] = useState(DEFAULT_SUMMARY_VALUES);
  const [parametersValues, setParametersValues] = useState(DEFAULT_PARAMETERS_VALUES);
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const { account } = useAccount();
  const { getChainBalanceValue } = useBalanceFormat();
  const alert = useAlert();
  const navigate = useNavigate();

  const ipfs = useIPFS();
  const { collectionsMetadata } = useMetadata();
  const collectionMetadata = collectionsMetadata?.[SIMPLE_COLLECTION_ID];
  const sendMessage = useMarketplaceMessage();

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

  const uploadToIpfs = async (file: File) => {
    const { cid } = await ipfs.add(file);

    return `ipfs://${cid.toString()}`;
  };

  const getNftPayload = async ({ file, limit }: NFT) => {
    const cid = await uploadToIpfs(file);

    const limitCopies = limit || null;
    const autoChangingRules = null;

    return [cid, { limitCopies, autoChangingRules }];
  };

  const getFormPayload = async (nfts: NFT[]) => {
    const collectionOwner = account?.decodedAddress;

    const { cover, logo, name, description, telegram, medium, discord, url: externalUrl, x: xcom } = summaryValues;
    const { mintPermission, isTransferable, isSellable, tags, royalty, mintLimit, mintPrice } = parametersValues;

    const collectionBanner = cover ? await uploadToIpfs(cover) : null;
    const collectionLogo = logo ? await uploadToIpfs(logo) : null;
    const additionalLinks = { telegram, medium, discord, externalUrl, xcom };

    const userMintLimit = mintLimit || null;
    const transferable = isTransferable ? '0' : null;
    const sellable = isSellable ? '0' : null;
    const paymentForMint = getChainBalanceValue(mintPrice || '0').toFixed();

    const collectionTags = tags.map(({ value }) => value);

    const imgLinksAndData = await Promise.all(nfts.map((nft) => getNftPayload(nft)));

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
      transferable,
      sellable,
      collectionTags,
    };

    return { collectionOwner, config, imgLinksAndData, permissionToMint };
  };

  const getBytesPayload = (payload: Awaited<ReturnType<typeof getFormPayload>>) => {
    if (!collectionMetadata) throw new Error('NFT metadata not found');

    const initTypeIndex = collectionMetadata.types.init.input;

    if (initTypeIndex == null) throw new Error('init.input type index not found in NFT metadata');

    const encoded = collectionMetadata.createType(initTypeIndex, payload).toU8a();

    return Array.from(encoded);
  };

  const handleNFTsSubmit = async ({ nfts }: NFTsValues) => {
    enableLoading();

    const formPayload = await getFormPayload(nfts);
    const bytesPayload = getBytesPayload(formPayload);
    const payload = { CreateCollection: { typeName: COLLECTION_NAME, payload: bytesPayload } };

    const onSuccess = ({ collectionCreated }: CreateCollectionReply) => {
      const id = collectionCreated.collectionAddress;
      const url = generatePath(ROUTE.COLLECTION, { id });

      navigate(url);
      alert.success('Collection created');
    };

    const onFinally = disableLoading;

    sendMessage({ payload, onSuccess, onFinally });
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
