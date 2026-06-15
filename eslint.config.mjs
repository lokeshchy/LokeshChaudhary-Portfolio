import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'tsconfig.tsbuildinfo'] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      // Intentional patterns here (hydration mount flags, post-fetch state syncing)
      // legitimately set state from effects; surface as a warning, not a build-failing error.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]
