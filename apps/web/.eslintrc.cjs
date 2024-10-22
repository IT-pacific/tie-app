module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // Encourage explicit return types
    '@typescript-eslint/ban-ts-comment': 'warn', // Warn about usage of `@ts-ignore`
    '@typescript-eslint/no-explicit-any': 'warn', // Warn against using 'any'
    'prettier/prettier': 'warn',
    'react/prop-types': 'off',
    'react/jsx-key': 'error', // Enforce unique "key" prop for JSX elements in lists
    'react/jsx-no-bind': 'warn', // Prevent binding in JSX props
    'react-hooks/rules-of-hooks': 'error', // Enforce rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Enforce dependencies in useEffect
    'no-magic-numbers': ['warn', { ignore: [0, 1], ignoreArrayIndexes: true }], // Warn about magic numbers
    'no-implicit-coercion': ['warn', { allow: ['!!'] }], // Warn about implicit type coercion
    'consistent-return': 'error', // Require consistent return behavior in functions
    'default-case': 'warn', // Encourage default case in switch statements
    'no-restricted-syntax': ['error', 'WithStatement'], // Disallow `with` statements
    'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error'] }] : 'warn', // Restrict console.log in production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn', // Restrict debugger in production
    'complexity': ['warn', { max: 10 }], // Limit complexity of functions
    'max-lines': ['warn', { max: 300 }], // Limit the number of lines in a file
    'max-params': ['warn', 4], // Limit the number of parameters in functions
    'no-trailing-spaces': ['error', { ignoreComments: true, skipBlankLines: true }], // Disallow trailing spaces
    'eol-last': ['error', 'always'], // Ensure newline at the end of files
    'indent': ['error', 2], // Enforce 2-space indentation
    'semi': ['error', 'always'], // Require semicolons
    'quotes': ['error', 'single'], // Enforce single quotes
    'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multiline objects and arrays
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'], // Ensure consistent linebreak style
  },
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
};
