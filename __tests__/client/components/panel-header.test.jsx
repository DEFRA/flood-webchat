import '../methods.mock'
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
  const realLocation = window.location
  const realHistory = window.history

  afterAll(() => {
    window.location = realLocation
    window.history = realHistory

    jest.clearAllMocks()
  })

  it('should render the close webchat button', () => {
    mocks.useApp.mockReturnValue({ thread: null })

    render(
      <PanelHeader />
    )

    expect(screen.getByLabelText('Close the webchat')).toBeTruthy()
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
      threadId: 'thread_123',
      thread: {
        lastMessageSeen: jest.fn()
      }
    })

    const { container } = render(
      <PanelHeader />
    )

    fireEvent.click(container.querySelector('button'))

    expect(mocks.useApp().setChatVisibility).toHaveBeenCalled()
    expect(mocks.useApp().thread.lastMessageSeen).toHaveBeenCalled()
  })

  it('if no chat when closed it will not reset unseen count', () => {
    mocks.useApp.mockReturnValue({
      setChatVisibility: jest.fn(),
      setUnseenCount: jest.fn()
    })

    const { container } = render(
      <PanelHeader />
    )

    fireEvent.click(container.querySelector('button'))

    expect(mocks.useApp().setChatVisibility).toHaveBeenCalledTimes(1)
    expect(mocks.useApp().setUnseenCount).toHaveBeenCalledTimes(0)
  })

  it('[mobile] should show the close button when there is no thread', () => {
    mocks.useApp.mockReturnValue({ thread: null, isMobile: true })

    window.innerWidth = 500
    fireEvent(window, new Event('resize'))

    const { container } = render(
      <PanelHeader />
    )

    expect(container.querySelector('.wc-header__close')).toBeTruthy()
    expect(container.querySelector('.wc-header__back')).toBeFalsy()
    expect(container.querySelector('.wc-header__hide')).toBeFalsy()
  })

  it('[mobile] should show the minimise button when there is a thread', () => {
    mocks.useApp.mockReturnValue({ thread: {}, isMobile: true })

    window.innerWidth = 500
    fireEvent(window, new Event('resize'))

    const { container } = render(
      <PanelHeader />
    )

    expect(container.querySelector('.wc-header__close')).toBeFalsy()
    expect(container.querySelector('.wc-header__back')).toBeFalsy()
    expect(container.querySelector('.wc-header__hide')).toBeTruthy()
  })
})
