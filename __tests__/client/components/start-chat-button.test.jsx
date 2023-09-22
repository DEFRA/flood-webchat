import React from 'react'
import { render } from '@testing-library/react'
import { StartChatButton } from '../../../src/client/components/start-chat-button'

describe('<StartChatButton/>', () => {
  it('renders a <button/> with the contents "Start Chat"', () => {
    // Arrange
    const props = {}

    // Act
    const { container } = render(<StartChatButton {...props} />)
    const element = container.children[0]

    // Assert
    expect(element.className).toEqual('')
    expect(element.textContent).toEqual('Start Chat')
  })

  it('renders a <button/> with a custom className if provided', () => {
    // Arrange
    const props = { className: 'example__class' }

    // Act
    const { container } = render(<StartChatButton {...props} />)
    const element = container.children[0]

    // Assert
    expect(element.className).toEqual('example__class')
  })
})
