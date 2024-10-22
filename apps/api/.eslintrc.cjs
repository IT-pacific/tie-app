module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier', // Integrates Prettier with ESLint for code formatting
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                '.eslintrc.{js,cjs}',
            ],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Allow the use of 'any'
        'arrow-parens': 'off', // No need for parentheses around a single arrow function parameter
        'class-methods-use-this': 'off', // Allow methods not using 'this'
        'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multiline objects and arrays
        'eol-last': ['error', 'always'], // Ensure a newline at the end of files
        'indent': ['error', 4], // Enforce 4-space indentation
        'key-spacing': ['error'], // Enforce spacing between keys and values in object literals
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'], // Adjust linebreak style based on the operating system
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }], // Ensure lines between class members
        'max-len': ['error', { code: 256 }], // Set the maximum line length
        'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error'] }] : 'off', // Allow console.log in development but restrict in production
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // Allow debugger during development
        'no-trailing-spaces': ['error', { ignoreComments: true, skipBlankLines: true }], // Disallow trailing spaces with some exceptions
        'padded-blocks': ['error', 'never'], // Disallow padding inside blocks
        'quotes': ['error', 'single'], // Enforce single quotes
        'semi': 'error', // Require semicolons
    },
    ignorePatterns: ['dist', 'node_modules'], // Ignore compiled files and dependencies
};
