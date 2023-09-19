import { foo } from '../../src/server'

describe('foo()', () => {
  it('should return true if called with \'bar\'', () => {
    // Arrange
    const value = 'bar'

    // Act
    const actual = foo(value)

    // Assert
    expect(actual).toEqual(true)
  })
})
