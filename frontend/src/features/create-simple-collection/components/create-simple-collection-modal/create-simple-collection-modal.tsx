import { useAccount, useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { Button, ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import { Container } from '@/components';
import { ROUTE } from '@/consts';
import { useMarketplace } from '@/context';
import { useProgramInstance as useNFTProgram } from '@/hooks/sails/nft';
import {
  useSendCreateCollectionTransaction,
  useProgramInstance as useShowroomProgram,
} from '@/hooks/sails/showroom/api.ts';

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

  const { marketplace } = useMarketplace();
  const { sendTransactionAsync: sendCreateCollection, isPending } = useSendCreateCollectionTransaction();

  // Get the code_id for Simple NFT Collection from marketplace
  // const simpleCollectionType = marketplace?.collectionTypes?.find((type) => type.type === COLLECTION_TYPE_NAME.SIMPLE);
  // For now, we'll use a placeholder. In real implementation, you'd get the actual code_id from marketplace
  const nftCodeId = '0x00';
  const { data: nftProgram } = useNFTProgram(nftCodeId as `0x${string}`);

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

  const getBytesPayload = (payload: Awaited<ReturnType<typeof getFormPayload>>): `0x${string}` => {
    if (!nftProgram) throw new Error('NFT Program is not initialized');

    const { collectionOwner, config, imgLinksAndData, permissionToMint } = payload;

    // Create the payload structure that matches the collection's init function
    // According to IDL: New : (collection_owner: actor_id, config: Config, img_links_and_data: vec struct { str, ImageData }, permission_to_mint: opt vec actor_id)
    const collectionPayload = [collectionOwner, config, imgLinksAndData, permissionToMint];

    // Encode as ("New", payload) like in Rust
    const request = ['New', collectionPayload];

    // Use sails-js registry to properly encode the payload
    const encoded = nftProgram.registry
      .createType('(String, ([u8;32], Config, Vec<(String, ImageData)>, Option<Vec<[u8;32]>>))', request)
      .toU8a();

    return `0x${Array.from(encoded)
      .map((byte: number) => byte.toString(16).padStart(2, '0'))
      .join('')}`;
  };

  // Test function to verify encoding with the same values as Rust developer
  const testEncoding = (): `0x${string}` | undefined => {
    if (!nftProgram) return;

    console.log('NFT Program found');

    const testPayload = [
      '0x041071d04513c136396ca4e62eaf2c59d021a2720ba6be071a1a8363ec5f3d59', // ActorId
      {
        name: 'name',
        description: 'description',
        collection_tags: [],
        collection_banner: 'collection_banner',
        collection_logo: 'collection_logo',
        user_mint_limit: null,
        additional_links: null,
        royalty: 0,
        payment_for_mint: 0,
        transferable: null,
        sellable: null,
        variable_meta: false,
      },
      [['link_1', { limit_copies: null, name: null }]], // img_links_and_data
      null, // permission_to_mint
    ];

    // Encode as ("New", payload) like in Rust
    const request = ['New', testPayload];

    console.log('request formed');
    const encoded = nftProgram.registry
      .createType('(String, ([u8;32], Config, Vec<(String, ImageData)>, Option<Vec<[u8;32]>>))', request)
      .toU8a();

    console.log('Test encoding result:', Array.from(encoded));
    console.log(
      'Expected from Rust:',
      [
        12, 78, 101, 119, 4, 16, 113, 208, 69, 19, 193, 54, 57, 108, 164, 230, 46, 175, 44, 89, 208, 33, 162, 114, 11,
        166, 190, 7, 26, 26, 131, 99, 236, 95, 61, 89, 16, 110, 97, 109, 101, 44, 100, 101, 115, 99, 114, 105, 112, 116,
        105, 111, 110, 0, 68, 99, 111, 108, 108, 101, 99, 116, 105, 111, 110, 95, 98, 97, 110, 110, 101, 114, 60, 99,
        111, 108, 108, 101, 99, 116, 105, 111, 110, 95, 108, 111, 103, 111, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 4, 24, 108, 105, 110, 107, 95, 49, 0, 0, 0,
      ],
    );

    return `0x${Array.from(encoded)
      .map((byte: number) => byte.toString(16).padStart(2, '0'))
      .join('')}`;
  };

  const handleNFTsSubmit = async ({ nfts }: NFTsValues, fee: bigint) => {
    try {
      // Test encoding first
      console.log('Testing encoding with Rust values...');
      testEncoding();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // const formPayload = await getFormPayload(nfts);
      // const bytesPayload = getBytesPayload(formPayload);
      // const resData = await sendCreateCollection({ args: [COLLECTION_TYPE_NAME.SIMPLE, bytesPayload], value: fee });
      // console.log({ resData });
      // const url = generatePath(ROUTE.COLLECTION, { id: response.collectionCreated.collectionAddress });
      // navigate(url);
      alert.success('Collection created');
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
            <p>Unexpected error occurred.</p>
          </Container>
        );
    }
  };

  return (
    <FullScreenModal heading="Create Simple NFT Collection" steps={STEPS} stepIndex={stepIndex} close={close}>
      <Button
        onClick={() => {
          try {
            console.log('Testing encoding with Rust values...');
            testEncoding();
          } catch (error) {
            alert.error(error instanceof Error ? error.message : String(error));
          }
        }}
      >
        click me
      </Button>
      {getForm()}
    </FullScreenModal>
  );
}

export { CreateSimpleCollectionModal };
