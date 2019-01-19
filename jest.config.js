// For a detailed explanation regarding each configuration property, visit:
// * https://jestjs.io/docs/en/configuration.html
// * https://kulshekhar.github.io/ts-jest/user/config/

module.exports = {
    preset: 'ts-jest',
    coverageDirectory: 'build/test-coverage',
    roots: [
        '<rootDir>/src'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: [
        '**/*.test.+(ts|tsx|js|jsx)',
        '**/*.spec.+(ts|tsx|js|jsx)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    }
};
