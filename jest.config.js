/** Configuracion de Jest para pruebas con TypeScript (ts-jest) */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/tests/setupEnv.ts'],
  verbose: true,
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts'],
};
