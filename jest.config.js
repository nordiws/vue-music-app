module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  setupFiles: ['<rootDir>/tests/setup.js'],
};
