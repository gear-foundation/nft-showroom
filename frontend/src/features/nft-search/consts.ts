import { z } from 'zod';

const FIELD_NAME = {
  QUERY: 'query',
};

const SCHEMA = z.object({
  [FIELD_NAME.QUERY]: z.string().trim(),
});

export { FIELD_NAME, SCHEMA };
