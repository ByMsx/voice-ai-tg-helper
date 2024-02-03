module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "project": ["./tsconfig.json"],
  },
  "plugins": [
    "@typescript-eslint",
    "prettier",
  ],
  "rules": {
    "no-unused-vars": 0,
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/no-non-null-assertion": 0,
    "prettier/prettier": ["error", { singleQuote: true }, { usePrettierrc: true }]
  }
}
