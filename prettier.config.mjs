/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  semi: true,

  plugins: ['@ianvs/prettier-plugin-sort-imports'],

  importOrder: ['<THIRD_PARTY_MODULES>', '', '^@/(.*)$', '', '^[.]'],
};
