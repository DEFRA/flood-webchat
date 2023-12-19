import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { PanelHeader } from '../../../src/client/components/panel/panel-header'
import { useApp } from '../../../src/client/store/useApp'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => {})
jest.mock('../../../src/client/store/useApp')

const mocks = {
  useApp: jest.mocked(useApp)
}

describe('<PanelHeader />', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should render the close webchat button', () => {
    mocks.useApp.mockReturnValue({ thread: null })

    const { container } = render(
      <PanelHeader />
    )

    expect(screen.getByLabelText('Close the webchat')).toBeTruthy()
    expect(container.querySelector('.govuk-back-link')).toBeFalsy()
  })

  it('should render the minimise webchat button', () => {
    mocks.useApp.mockReturnValue({ thread: {} })

    render(
      <PanelHeader />
    )

    expect(screen.getByLabelText('Minimise the webchat')).toBeTruthy()
  })

  it('should close chat on click', () => {
    mocks.useApp.mockReturnValue({
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn(),
      thread: {
        lastMessageSeen: jest.fn()
      }
    })

    const { container } = render(
      <PanelHeader />
    )

    fireEvent.click(container.querySelector('button'))

    expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
  })

  xit('should close the chat when "ESC" is pressed', async () => {
    mocks.useApp.mockReturnValue({
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn(),
      thread: {
        lastMessageSeen: jest.fn()
      }
    })

    const { container } = render(
      <PanelHeader />
    )

    fireEvent.keyPress(container, { key: 'Escape' })

    expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
  })
})
