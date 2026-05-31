import { resolve } from 'path';

import { eslintConfig } from '@gear-js/frontend-configs';

export default eslintConfig({
  tsConfigs: [resolve(process.cwd(), 'tsconfig.app.json')],
});
