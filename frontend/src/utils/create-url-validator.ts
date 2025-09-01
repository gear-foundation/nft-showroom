import { z } from 'zod';

type NormalizeFn = (input: string) => string;

export const createUrlValidator = (
  regex: RegExp,
  message: string,
  options?: {
    normalizeInput?: NormalizeFn;
    requireValidUrlSyntax?: boolean;
    optional?: boolean;
  },
) => {
  const { normalizeInput, requireValidUrlSyntax = false, optional = true } = options || {};

  return z
    .string()
    .trim()
    .transform((str) => {
      if (optional && str === '') return null;
      let value = str;

      if (normalizeInput) {
        value = normalizeInput(value);
      }

      return value;
    })
    .nullable()
    .default(optional ? null : '')
    .refine((val) => {
      if (!val) return true;

      let url: URL;
      if (requireValidUrlSyntax) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          url = new URL(val.startsWith('http') ? val : `https://${val}`);
        } catch {
          return false;
        }
      }

      return regex.test(val);
    }, message);
};
