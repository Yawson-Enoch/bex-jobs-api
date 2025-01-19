/**  @type {import('lint-staged').Configuration} */
export default {
  '*.ts': 'eslint --fix',
  '*': 'prettier --write --ignore-unknown',
};
