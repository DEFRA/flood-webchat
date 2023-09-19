import { init } from '../../src/client'
import { act } from '@testing-library/react'

describe('init()', () => {
  it('should return true if called with true', () => {
    // Arrange
    const targetElement = document.createElement('div')
    document.body.appendChild(targetElement)

    // Act
    act(() => {
      init(targetElement)
    })

    // Assert
    expect(targetElement.firstChild.textContent).toEqual('Start Chat')
  })
})
