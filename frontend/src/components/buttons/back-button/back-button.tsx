import { Button, ButtonProps } from '@gear-js/vara-ui';
import { useNavigate } from 'react-router-dom';

type Props = Omit<ButtonProps, 'text' | 'children' | 'onClick'>;

function BackButton(props: Props) {
  const navigate = useNavigate();

  return <Button {...props} text="Go Back" onClick={() => navigate(-1)} />;
}

export { BackButton };
