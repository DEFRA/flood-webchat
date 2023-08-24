/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.?(m)js?(x)', '**/?(*.)+(spec|test).?(m)js?(x)'],
  transform: {
    '\\.m?jsx?$': 'babel-jest'
  }
}

module.exports = config
