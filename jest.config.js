/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '\\.m?jsx?$': 'babel-jest'
  },
  projects: [
    {
      displayName: 'client-side',
      testEnvironment: 'jsdom',
      testMatch: ['**/__tests__/client/**/*.?(m)js?(x)'],
      transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!uuid)'
      ]
    },
    {
      displayName: 'server-side',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/server/**/*.?(m)js?(x)']
    }
  ]
}

export default config
