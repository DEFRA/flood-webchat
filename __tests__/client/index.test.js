import { init } from '../../src/client/index.js'

describe('init()', () => {
  it('should return true if called with true', () => {
    // Arrange
    const value = true

    // Act
    const actual = init(value)

    // Assert
    expect(actual).toEqual(true)
  })
})
