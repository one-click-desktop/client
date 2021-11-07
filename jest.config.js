module.exports = {

    preset: 'jest-preset-angular',

    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],

    collectCoverageFrom: [
        '<rootDir>/src/app/**/*.ts',
        '!<rootDir>/src/app/**/index.ts',
        '!<rootDir>/src/app/**/*.module.ts'
    ],

    coverageDirectory: 'coverage',

    coverageReporters: [
        'lcov',
        'text-summary'
    ],

    testPathIgnorePatterns: [
        '<rootDir>/coverage/',
        '<rootDir>/dist/',
        '<rootDir>/e2e/',
        '<rootDir>/node_modules/',
        '<rootDir>/src/app/*.(js|scss)'
    ],

    testMatch: [
        '<rootDir>/src/app/*.spec.ts',
        '<rootDir>/src/app/**/*.spec.ts'
    ],

    moduleNameMapper: {
        "@views/(.*)": "<rootDir>/src/app/views/$1",
        "@components/(.*)": "<rootDir>/src/app/components/$1",
        "@services/(.*)": "<rootDir>/src/app/services/$1",
        "@testing/(.*)": "<rootDir>/src/app/testing/$1"
    },

    restoreMocks: true,
    clearMocks: true,
};