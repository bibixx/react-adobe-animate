module.exports = {
  "extends": "airbnb-typescript",
  "env": {
    "browser": true,
    "es6": true
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        config: "./build/webpack.dev.js",
      }
    }
  },
  "globals": {
    "AdobeAn": true
  },
  rules: {
    "import/no-commonjs": ["error", "always"],

    "react/forbid-prop-types": 0,
    "react/react-in-jsx-scope": 0,
    "react/jsx-filename-extension": 0,
    "react/no-deprecated": 0,
    "react/no-danger": 0,
    "react/jsx-curly-spacing": [2, {"when": "never", "allowMultiline": false}],
    "react/prefer-stateless-function": 0,
    "react/no-did-mount-set-state": 0,
    "no-sequences": 0,
    "react/static-property-placement": [1, "static public field"],
    "react/state-in-constructor": 0,
    "eol-last": ["error", "always"],
    "no-return-assign": 0,
    "function-paren-newline": 0,
    "func-names": 0,
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "no-console": 0,
    "prefer-template": "warn",
    "quote-props": ["error", "as-needed"],
    "indent": ["error", 2, { "SwitchCase": 1, "MemberExpression": 1 }],
    "no-plusplus": 0,
    "no-mixed-operators": ["error", {"allowSamePrecedence": true}]
  }
}
