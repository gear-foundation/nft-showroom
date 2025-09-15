import { eslintConfig } from '@gear-js/frontend-configs';

export default [
  // Ignored files and directories
  {
    ignores: [
      'codegen.ts',
      'eslint.config.ts',
      '**/*.d.ts',
      'node_modules/**/*',
      'dist/**/*',
      'build/**/*',
      '**/node_modules/**/*',
      '**/yarn*/**/*',
      '**/pnpm*/**/*',
      '**/npm*/**/*',
      '**/.pnpm/**/*',
    ],
  },
  // Configuration from @gear-js/frontend-configs
  ...eslintConfig,
  // Additional rules
  {
    rules: {
      '@typescript-eslint/no-base-to-string': 'off',
    },
  },
];
