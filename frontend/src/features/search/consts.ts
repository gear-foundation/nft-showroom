import { z } from 'zod';

const FIELD_NAME = {
  QUERY: 'query',
};

const DEFAULT_VALUES = {
  [FIELD_NAME.QUERY]: '',
};

const SCHEMA = z.object({
  [FIELD_NAME.QUERY]: z.string().trim(),
});

export { FIELD_NAME, DEFAULT_VALUES, SCHEMA };
