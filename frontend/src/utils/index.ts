import { decodeAddress } from '@gear-js/api';

import { ADDRESS } from '@/consts';
import { Entries } from '@/types';

const cx = (...args: unknown[]) =>
  args
    .filter((arg) => typeof arg === 'string')
    .join(' ')
    .trim();

const getTypedEntries = <T extends object>(value: T) => Object.entries(value) as Entries<T>;

const getIpfsLink = (value: string) => {
  if (!value.includes('ipfs://')) return `${ADDRESS.IPFS_GATEWAY}/${value}`; // handle legacy links (coinbase collection)

  const [, cid = ''] = value.split('ipfs://');

  return `${ADDRESS.IPFS_GATEWAY}/${cid}`;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && !Array.isArray(value) && value !== null;

const isValidAddress = (address: string) => {
  try {
    decodeAddress(address);
    return true;
  } catch {
    return false;
  }
};

export { cx, getTypedEntries, getIpfsLink, isObject, isValidAddress };
export { createUrlValidator } from './create-url-validator';
export { discordRegex, mediumRegex, telegramRegex, twitterRegex, urlRegex } from './regexp.ts';
