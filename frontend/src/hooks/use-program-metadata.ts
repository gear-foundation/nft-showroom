import { ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useState, useEffect } from 'react';

function useProgramMetadata(source: string) {
  const alert = useAlert();

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    if (!source) return;

    fetch(source)
      .then((response) => response.text())
      .then((metaRaw) => setMetadata(ProgramMetadata.from(`0x${metaRaw}`)))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return metadata;
}

export { useProgramMetadata };
