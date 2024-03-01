module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  overrides: [
    {
      files: ['webpack.*.js'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {},
};
