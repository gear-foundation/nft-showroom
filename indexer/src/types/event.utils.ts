import { Option, u128, u16, u32, u64 } from '@polkadot/types';
import { Codec } from '@polkadot/types-codec/types/codec';

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
