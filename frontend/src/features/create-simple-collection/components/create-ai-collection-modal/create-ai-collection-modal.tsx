import { useAccount, useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { Container } from '@/components';
import { ROUTE } from '@/consts';
import { useIPFS, useMetadata } from '@/context';
import { useLoading, useMarketplaceMessage } from '@/hooks';

import {
  COLLECTION_CODE_ID,
  COLLECTION_NAME,
  DEFAULT_DICTIONARY_VALUES,
  DEFAULT_PARAMETERS_VALUES,
  DEFAULT_SUMMARY_VALUES,
  STEPS,
} from '../../consts';
import { CreateCollectionReply, ParametersValues, SummaryValues } from '../../types';
import { DictionaryForm } from '../dictionary-form';
import { FullScreenModal } from '../full-screen-modal';
import { ParametersForm } from '../parameters-form';
import { SummaryForm } from '../summary-form';

function CreateAICollectionModal({ close }: Pick<ModalProps, 'close'>) {
  const [stepIndex, setStepIndex] = useState(2);
  const [summaryValues, setSummaryValues] = useState(DEFAULT_SUMMARY_VALUES);
  const [parametersValues, setParametersValues] = useState(DEFAULT_PARAMETERS_VALUES);
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const { account } = useAccount();
  const { getChainBalanceValue } = useBalanceFormat();
  const alert = useAlert();
  const navigate = useNavigate();

  const ipfs = useIPFS();
  const { collectionsMetadata } = useMetadata();
  const collectionMetadata = collectionsMetadata?.[COLLECTION_CODE_ID.AI];
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

  const getFormPayload = async (words: { value: string }[]) => {
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

    const dictionary = words.map(({ value }) => value);

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

    return { collectionOwner, config, dictionary, permissionToMint };
  };

  const getBytesPayload = (payload: Awaited<ReturnType<typeof getFormPayload>>) => {
    if (!collectionMetadata) throw new Error('NFT metadata not found');

    const initTypeIndex = collectionMetadata.types.init.input;

    if (initTypeIndex == null) throw new Error('init.input type index not found in NFT metadata');

    const encoded = collectionMetadata.createType(initTypeIndex, payload).toU8a();

    return Array.from(encoded);
  };

  const handleDictionarySubmit = async (words: { value: string }[]) => {
    enableLoading();

    const formPayload = await getFormPayload(words);
    const bytesPayload = getBytesPayload(formPayload);
    const payload = { CreateCollection: { typeName: COLLECTION_NAME.AI, payload: bytesPayload } };

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
          <DictionaryForm
            defaultValues={DEFAULT_DICTIONARY_VALUES}
            onBack={prevStep}
            onSubmit={handleDictionarySubmit}
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
    <FullScreenModal heading="Create AI NFT Collection" steps={STEPS.AI} stepIndex={stepIndex} close={close}>
      {getForm()}
    </FullScreenModal>
  );
}

export { CreateAICollectionModal };
