import { useApi } from '@gear-js/react-hooks';

import { getMilliseconds } from '../utils';

function useDefaultValues() {
  const { api, isApiReady } = useApi();

  const getDurationOptions = () => {
    if (!isApiReady) throw new Error('API is not initialized');

    const blockDurationMs = api.consts.babe.expectedBlockTime.toNumber();
    const dayMs = getMilliseconds(1, 'day');
    const blocksPerDay = dayMs / blockDurationMs;

    return new Array(30).fill(undefined).map((_, index) => {
      const dayNumber = index + 1;

      const label = `${dayNumber} ${dayNumber === 1 ? 'day' : 'days'}`;
      const value = blocksPerDay * dayNumber;

      return { label, value };
    });
  };

  const defaultOptions = getDurationOptions();

  const defaultValues = {
    duration: defaultOptions[0].value,
    minPrice: '',
  };

  return { defaultValues, defaultOptions };
}

export { useDefaultValues };
