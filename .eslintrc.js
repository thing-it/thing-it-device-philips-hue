/*
 * Base minimum JS linting, only enabling commonnly recommended rules
 */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: false,
    },
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  plugins: [
    "standard",
    "node",
    "promise",
  ],
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    //"plugin:promise/recommended",
  ],
  rules: {
    "no-unused-vars": "warn",

/*
    // optional rules, discuss within team and enable piece-wise
    "max-len": ["warn", 120],

    "constructor-super": "warn",
    "no-console": "off",
    "no-const-assign": "warn",
    "no-this-before-super": "warn",
    "no-undef": "warn",
    "no-unreachable": "warn",
    semi: "warn",
    strict: "error",
    "valid-typeof": "warn",
*/
  },
};
