module.exports = {
  "extends": ["airbnb-typescript"],
  "env": {
    "browser": true,
    "es6": true
  },
  "globals": {
    "AdobeAn": true
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    "import/no-default-export": 1,
    "import/prefer-default-export": 0,
    "react/static-property-placement": ["error", 'static public field'],
    "react/state-in-constructor": 0,
    "no-restricted-syntax": 0
  }
}
