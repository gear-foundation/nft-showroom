import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import CopySVG from '@/assets/copy.svg?react';

type Props = {
  value: string;
  onCopy?: () => void;
};

function CopyButton({ value, onCopy = () => {} }: Props) {
  const alert = useAlert();

  const onSuccess = () => {
    alert.success('Copied to clipboard');
    onCopy();
  };

  const onError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unexpected error copying to clipboard';

    alert.error(message);
    console.error(error);
  };

  const copyToClipboard = () => navigator.clipboard.writeText(value).then(onSuccess, onError);

  return <Button icon={CopySVG} color="transparent" onClick={copyToClipboard} />;
}

export { CopyButton };
