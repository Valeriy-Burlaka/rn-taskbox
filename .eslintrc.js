const path = require('path');

module.exports = {
  root: true,

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:import/recommended',
    'plugin:react-native-a11y/basic',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'prettier',
    'import',
    'react-native-a11y',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    // Since we don't use rules which require type info, we can set project: null to speed up linting (https://typescript-eslint.io/docs/linting/type-linting#how-is-performance)
    project: null,
  },

  env: {
    es6: true,
    jest: true,
  },
  globals: {
    __DEV__: false,
  },

  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },

  rules: {
    /// Prettier
    'prettier/prettier': 'warn',

    /// Vanilla
    'no-empty': 'off',
    'no-shadow': 'warn',
    'no-console': 'warn',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-labels': ['error', { allowLoop: true }],
    'object-shorthand': ['error', 'always'],
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['styles/theme/*', '!styles/theme/utils'],
            message:
              'Use `useTheme` hook for retrieving app theme instead, or style a component with `styled`.',
          },
        ],
      },
    ],
    'no-useless-return': 'off',

    /// TypeScript
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-use-before-define': 'off',

    /// React
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': [
      'warn',
      { props: 'never', children: 'never', propElementValues: 'always' },
    ],
    'react/prop-types': 'off',
    'react/self-closing-comp': 'warn',
    'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],

    /// React Native
    'react-native/no-raw-text': 'warn',

    // eslint-plugin-react-native-a11y
    'react-native-a11y/has-accessibility-hint': 'off',

    /// Imports
    'import/no-useless-path-segments': 'warn',
    'import/no-anonymous-default-export': 'error',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'import/extensions': ['warn', 'never', { svg: 'always', json: 'always' }],
    'import/order': [
      'warn',
      {
        groups: ['unknown', 'builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: 'resources/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: 'screens/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: 'components/**',
            group: 'internal',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
      },
    ],
  },
};
