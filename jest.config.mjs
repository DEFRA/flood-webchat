/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  transform: {
    '\\.jsx?$': 'babel-jest',
    '\\.mjs$': 'babel-jest'
  },
  projects: [
    {
      displayName: 'client-side',
      testEnvironment: 'jsdom',
      testMatch: ['**/__tests__/client/**/*.?(m)js?(x)'],
      transformIgnorePatterns: []
    },
    {
      displayName: 'server-side',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/server/**/*.?(m)js?(x)']
    }
  ]
}

export default config
