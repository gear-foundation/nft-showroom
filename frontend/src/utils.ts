import { Entries } from './types';

const cx = (...args: unknown[]) =>
  args
    .filter((arg) => typeof arg === 'string')
    .join(' ')
    .trim();

const getTypedEntries = <T extends object>(value: T) => Object.entries(value) as Entries<T>;

export { cx, getTypedEntries };
