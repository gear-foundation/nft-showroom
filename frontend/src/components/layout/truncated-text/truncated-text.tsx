import styles from './truncated-text.module.scss';

type Props = {
  value: string;
};

function TruncatedText({ value }: Props) {
  return <span className={styles.text}>{value}</span>;
}

export { TruncatedText };
