import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'src/routeTree.gen.ts'],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // shadcn UI components co-locate variant helpers, TanStack Router route
    // files must export a `Route` object, and context providers export their
    // hook — all intentional and safe here, so relax the fast-refresh rule.
    files: [
      'src/components/ui/**/*.{ts,tsx}',
      'src/routes/**/*.tsx',
      'src/components/theme-provider.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
