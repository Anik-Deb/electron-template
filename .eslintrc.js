module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'prettier', 'vite'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
