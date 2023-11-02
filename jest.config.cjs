module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json', // Specify the path to your tsconfig.json
    // Set the module format to 'commonjs' or other supported format
    },
  },
};
