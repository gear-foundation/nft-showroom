import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/components';
import { ROUTE } from '@/consts';

import SearchSVG from '../../assets/search.svg?react';
import { FIELD_NAME, SCHEMA } from '../../consts';
import { useNFTSearchParam } from '../../hooks';

function NFTSearch() {
  const param = useNFTSearchParam();

  const form = useForm({ values: { [FIELD_NAME.QUERY]: param.value }, resolver: zodResolver(SCHEMA) });
  const navigate = useNavigate();

  const handleSubmit = form.handleSubmit(({ query }) => {
    const search = query ? param.set(query) : param.reset();

    navigate({ pathname: ROUTE.NFTS, search });
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <Input name={FIELD_NAME.QUERY} icon={SearchSVG} label="NFT name/Account address" size="small" />
      </form>
    </FormProvider>
  );
}

export { NFTSearch };
