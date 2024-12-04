import { Option, u128, u16, u32, u64 } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

export function safeUnwrapToNumber(
  value: number | u16 | u32 | u64 | u128 | null,
): number | null {
  if (typeof value === 'number') {
    return value;
  }
  if (value === null) {
    return null;
  }
  return value.toNumber();
}

export function safeUnwrapToHex(value: Hash | string | null): string | null {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null) {
    return null;
  }
  return value.toHex();
}

export function safeUnwrapOptional<E extends Codec, T>(
  value: Option<E> | T | null,
): T | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (isOption(value)) {
    return value.unwrapOr<T | null>(null) as T | null;
  }
  return value;
}

function isOption<E extends Codec, T>(
  value: Option<E> | T | null,
): value is Option<E> {
  return (value as Option<E>).unwrapOr !== undefined;
}

export function safeUnwrapToBigInt(
  value: number | bigint | u16 | u32 | u64 | u128 | null,
): bigint | null {
  if (typeof value === 'number') {
    return BigInt(value);
  }
  if (typeof value === 'bigint') {
    return value;
  }
  if (value === null) {
    return null;
  }
  return value.toBigInt();
}
