import { ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useRef, useEffect, useState, ChangeEvent, DependencyList, EffectCallback } from 'react';

import { MAX_IMAGE_SIZE_MB } from './consts';
import { getBytesSize } from './utils';

function useProgramMetadata(source: string) {
  const alert = useAlert();

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    fetch(source)
      .then((response) => response.text())
      .then((metaRaw) => setMetadata(ProgramMetadata.from(`0x${metaRaw}`)))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return metadata;
}

function useImageInput(defaultValue: File | undefined, types: string[]) {
  const alert = useAlert();

  // should also set defaultValue to inputRef on mount?
  const [value, setValue] = useState(defaultValue);
  const ref = useRef<HTMLInputElement>(null);

  const handleClick = () => ref.current?.click();

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { files } = target;

    if (!files || !files.length) {
      setValue(undefined);
      return;
    }

    const [file] = files;
    const { size, type } = file;

    if (size > getBytesSize(MAX_IMAGE_SIZE_MB)) {
      target.value = '';
      return alert.error('Max file size is exceeded');
    }

    if (!types.includes(type)) {
      target.value = '';
      return alert.error('Wrong file format');
    }

    setValue(file);
  };

  const handleReset = () => {
    if (!ref.current) return;

    ref.current.value = '';

    const changeEvent = new Event('change', { bubbles: true });
    ref.current.dispatchEvent(changeEvent);
  };

  const accept = types.join(',');
  const props = { ref, accept, onChange };

  return { value, props, handleClick, handleReset };
}

function useChangeEffect(callback: EffectCallback, dependencies?: DependencyList) {
  const mounted = useRef(false);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  useEffect(() => {
    if (mounted.current) return callback();

    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

export { useProgramMetadata, useImageInput, useChangeEffect };
