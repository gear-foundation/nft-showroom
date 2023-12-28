import { CreateType } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';

import { Container } from '@/components';
import { useIPFS } from '@/context';

import { DEFAULT_NFTS_VALUES, DEFAULT_PARAMETERS_VALUES, DEFAULT_SUMMARY_VALUES, STEPS } from '../../consts';
import { NFT, NFTsValues, ParametersValues, SummaryValues } from '../../types';
import { FullScreenModal } from '../full-screen-modal';
import { SummaryForm } from '../summary-form';
import { ParametersForm } from '../parameters-form';
import { NFTForm } from '../nft-form';

function CreateSimpleCollectionModal({ close }: Pick<ModalProps, 'close'>) {
  const [stepIndex, setStepIndex] = useState(0);
  const [summaryValues, setSummaryValues] = useState(DEFAULT_SUMMARY_VALUES);
  const [parametersValues, setParametersValues] = useState(DEFAULT_PARAMETERS_VALUES);
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useAccount();
  const ipfs = useIPFS();

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

  const getTrimmedValues = <T extends Record<string, string>>(values: T) => {
    const trimmedEntries = Object.entries(values).map(([key, value]) => [key, value.trim()]);

    return Object.fromEntries(trimmedEntries) as T;
  };

  const uploadToIpfs = async (file: File) => {
    const { cid } = await ipfs.add(file);

    return cid.toString();
  };

  const getNftPayload = async ({ file, limit }: NFT) => {
    const cid = await uploadToIpfs(file);

    const limitCopies = limit.trim() || null;
    const autoChangingRules = null;

    return [cid, { limitCopies, autoChangingRules }];
  };

  const getPayload = async (nfts: NFT[]) => {
    const collectionOwner = account?.decodedAddress;

    const { cover, logo, ...summaryTextValues } = summaryValues;
    const trimmedSummaryValues = getTrimmedValues(summaryTextValues);
    const { name, description, telegram, medium, discord, url: externalUrl, x: xcom } = trimmedSummaryValues;

    const { isTransferable, isSellable, tags, ...parametersTextValues } = parametersValues;
    const trimmedParametersValues = getTrimmedValues(parametersTextValues);
    const { royalty, mintLimit: userMintLimit, mintPrice: paymentForMint } = trimmedParametersValues;

    const collectionBanner = cover ? await uploadToIpfs(cover) : null;
    const collectionLogo = logo ? await uploadToIpfs(logo) : null;
    const additionalLinks = { telegram, medium, discord, externalUrl, xcom };

    const transferable = isTransferable ? '0' : null;
    const sellable = isSellable ? '0' : null;

    const collectionTags = tags.map(({ value }) => value);

    const imgLinks = await Promise.all(nfts.map((nft) => getNftPayload(nft)));

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

    return { collectionOwner, config, imgLinks };
  };

  const handleNFTsSubmit = async ({ nfts }: NFTsValues) => {
    setIsLoading(true);

    const payload = await getPayload(nfts);
    const bytesPayload = CreateType.create('Bytes', payload);

    console.log('bytesPayload: ', bytesPayload);

    setIsLoading(false);
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
