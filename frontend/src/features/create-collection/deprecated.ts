import { useState, useEffect, useRef, useImperativeHandle } from 'react';
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
