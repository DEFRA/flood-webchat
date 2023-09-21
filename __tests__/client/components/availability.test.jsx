import React from 'react'
import { render } from '@testing-library/react'
import { Availability } from '../../../src/client/components/availability/availability'

describe('<Availability/>', () => {
  // onKeyDown
  // onKeyUp
  // onClick
  // When open and out of viewport
  // When closed and out of viewport
  // When open and in viewport
  // When closed and in viewport
  // When no existing thread
  // When existing thread with no unread messages
  // When existing thread with one unread message
  // When existing thread with multiple unread messages
  it('renders a <button/> with the contents "Start Chat"', () => {
    // Arrange
    const props = {}

    // Act
    const { container } = render(<Availability {...props} />)
    const element = container.children[0]

    // Assert
    expect(element.className).toEqual('')
    expect(element.textContent).toEqual('Start Chat')
  })

  it('renders a <button/> with a custom className if provided', () => {
    // Arrange
    const props = { className: 'example__class' }

    // Act
    const { container } = render(<Availability {...props} />)
    const element = container.children[0]

    // Assert
    expect(element.className).toEqual('example__class')
  })
})
