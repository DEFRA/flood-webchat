import { init } from '../src/browser.mjs'

describe('example test', () => {
  it('should recognise truth', () => {
    // Arrange
    const value = true

    // Act
    const actual = init(value)

    // Assert
    expect(actual).toEqual(true)
  })
})
