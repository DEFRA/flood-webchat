import { classnames } from '../../../src/client/lib/classnames'

describe('classnames', () => {
  it('removes falsey class names from returned string', () => {
    // Arrange
    const classArray = [
      'valid-class',
      false,
      null,
      undefined,
      0
    ]

    // Act
    const className = classnames(...classArray)

    // Assert
    expect(className).toEqual('valid-class')
  })

  it('removes non-string class names from returned string', () => {
    // Arrange
    const classArray = [
      'valid-class',
      1,
      [],
      {}
    ]

    // Act
    const className = classnames(...classArray)

    // Assert
    expect(className).toEqual('valid-class')
  })
})
