import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import DiscordSVG from '@/assets/discord.svg?react';
import MediumSVG from '@/assets/medium.svg?react';
import TelegramSVG from '@/assets/telegram.svg?react';
import TwitterSVG from '@/assets/twitter.svg?react';
import WebSVG from '@/assets/web.svg?react';
import { Container, Input, Form, Textarea } from '@/components';

import CameraSVG from '../../assets/camera.svg?react';
import PlaceholderSVG from '../../assets/placeholder.svg?react';
import { IMAGE_TYPES } from '../../consts';
import { useImageInput } from '../../hooks';
import { SummaryValues } from '../../types';
import { getFileUrl } from '../../utils';
import { DeleteButton } from '../delete-button';

import styles from './summary-form.module.scss';

type Props = {
  defaultValues: SummaryValues;
  onSubmit: (values: SummaryValues) => void;
  onBack: () => void;
};

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  url: z.string().trim().optional().or(z.literal('')),
  telegram: z.string().trim().optional().or(z.literal('')),
  x: z.string().trim().optional().or(z.literal('')),
  medium: z.string().trim().optional().or(z.literal('')),
  discord: z.string().trim().optional().or(z.literal('')),
});

function SummaryForm({ defaultValues, onSubmit, onBack }: Props) {
  const alert = useAlert();

  const cover = useImageInput(defaultValues.cover, IMAGE_TYPES);
  const coverStyle = cover.value ? { backgroundImage: `url(${getFileUrl(cover.value)})` } : undefined;

  const logo = useImageInput(defaultValues.logo, IMAGE_TYPES);
  const logoStyle = logo.value ? { backgroundImage: `url(${getFileUrl(logo.value)})` } : undefined;

  return (
    <Form
      defaultValues={defaultValues}
      schema={schema}
      onSubmit={(data) => {
        if (!cover.value || !logo.value) return alert.error('Cover and logo are required');

        onSubmit({ ...data, cover: cover.value, logo: logo.value });
      }}
      className={styles.form}>
      <Container>
        <header className={styles.header}>
          <div className={styles.cover} style={coverStyle}>
            <input type="file" className={styles.fileInput} {...cover.props} />

            {cover.value ? (
              <DeleteButton className={styles.deleteButton} onClick={cover.handleReset} />
            ) : (
              <>
                <h4 className={styles.heading}>Collection Cover</h4>

                <div className={styles.text}>
                  <p>Upload a cover image with the recommended dimensions of 1200x260 pixels.</p>
                  <p>File formats: .jpg, .jpeg, .png. Max size: 5mb</p>
                </div>

                <Button text="Select File" size="small" color="contrast" onClick={cover.handleClick} />
              </>
            )}

            <div className={styles.logo}>
              <input type="file" className={styles.fileInput} {...logo.props} />
              <button type="button" className={styles.button} onClick={logo.handleClick} style={logoStyle}>
                {!logo.value && <CameraSVG />}
              </button>

              {logo.value && <DeleteButton className={styles.deleteButton} onClick={logo.handleReset} />}
            </div>
          </div>

          <div className={styles.placeholder}>
            <PlaceholderSVG />
          </div>
        </header>
      </Container>

      <Container maxWidth="sm">
        <div className={styles.inputs}>
          <Input name="name" label="Name" />

          <Textarea name="description" label="Description" rows={2} />
        </div>

        <div className={styles.inputs}>
          <h4 className={styles.heading}>Links (optional):</h4>

          <Input name="url" icon={WebSVG} label="URL" />
          <Input name="telegram" icon={TelegramSVG} label="Telegram" />
          <Input name="x" icon={TwitterSVG} label="X.com" />
          <Input name="medium" icon={MediumSVG} label="Medium" />
          <Input name="discord" icon={DiscordSVG} label="Discord" />

          <div className={styles.buttons}>
            <Button text="Cancel" color="grey" onClick={onBack} />
            <Button type="submit" text="Continue" />
          </div>
        </div>
      </Container>
    </Form>
  );
}

export { SummaryForm };
