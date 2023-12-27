import { ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

function useFileUrl(fileList: FileList | undefined) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!fileList || !fileList.length) return setUrl('');

    const [file] = fileList;
    const result = URL.createObjectURL(file);

    setUrl(result);
  }, [fileList]);

  return url;
}

function useRegisterRef<T extends string>({ ref: registerRef, ...props }: UseFormRegisterReturn<T>) {
  const ref = useRef<HTMLInputElement>(null);
  useImperativeHandle(registerRef, () => ref.current as HTMLInputElement);

  return [ref, props] as const;
}

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

export { useFileUrl, useRegisterRef, useProgramMetadata };
