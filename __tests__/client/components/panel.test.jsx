import React from 'react'
import { userEvent } from '@testing-library/user-event'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Panel } from '../../../src/client/components/panel/panel'
import { useApp, useChatSdk } from '../../../src/client/store/AppProvider'

jest.mock('../../../src/client/store/AppProvider')

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({
  ChatEvent: {
    LIVECHAT_RECOVERED: jest.mocked(),
    MESSAGE_CREATED: jest.mocked(),
    AGENT_TYPING_STARTED: jest.mocked(),
    AGENT_TYPING_ENDED: jest.mocked(),
    MESSAGE_SEEN_BY_END_USER: jest.mocked(),
    ASSIGNED_AGENT_CHANGED: jest.mocked(),
    CONTACT_CREATED: jest.mocked(),
    CONTACT_STATUS_CHANGED: jest.mocked()
  }
}))

const useAppMock = {
  sdk: jest.mocked({
    authorize: jest.fn(),
    getCustomer: function () {
      this.setName = jest.fn()
      return this
    }
  }),
  messages: [],
  setCustomerId: jest.fn(),
  setThreadId: jest.fn(),
  setChatRequested: jest.fn(),
  setThread: jest.fn()
}

const mocks = {
  useApp: jest.mocked(useApp),
  useChatSdk: jest.mocked(useChatSdk)
}

mocks.useApp.mockReturnValue(useAppMock)

mocks.useChatSdk.mockReturnValue({
  connect: jest.fn(),
  getCustomerId: jest.fn(),
  recoverThread: jest.fn(),
  getThread: () => ({
    thread: {
      startChat: jest.fn
    }
  })
})

describe('<Panel />', () => {
  let container

  beforeEach(() => {
    const result = render(
      <>
        <a href='#' className='wc-availability__link'>Start Chat</a>
        <div id='wc-panel'>
          <Panel />
        </div>
      </>
    )

    container = result.container
  })

  it('should render the panel title', () => {
    expect(screen.getByText('Floodline Webchat')).toBeTruthy()
  })

  it('should render panel close button', () => {
    expect(screen.getByLabelText('Close the webchat')).toBeTruthy()
  })

  it('should add [aria-hidden="true"] to <body> child elements', () => {
    expect(container.getAttribute('aria-hidden')).toEqual('true')
  })

  it('should focus elements within the webchat when tab targeting and return to the top after the last element has been focused', async () => {
    const user = userEvent.setup()

    const closeButton = screen.getByLabelText('Close the webchat')
    const link1 = screen.getByText('sign up for flood warnings')
    const link2 = screen.getByText('manage your flood warnings account')
    const link3 = screen.getByText('report a flood')
    const button = screen.getByText('Continue')
    const link4 = screen.getByText('Find out more about call charges')

    await user.tab()
    expect(closeButton).toHaveFocus()

    await user.tab()
    expect(link1).toHaveFocus()

    await user.tab()
    expect(link2).toHaveFocus()

    await user.tab()
    expect(link3).toHaveFocus()

    await user.tab()
    expect(button).toHaveFocus()

    await user.tab()
    expect(link4).toHaveFocus()

    await user.tab()
    expect(closeButton).toHaveFocus()
  })

  it('should focus the elements, in reverse-order, within the webchat when shift-tab targeting and return to the bottom after the first element has been focused', async () => {
    const user = userEvent.setup()

    const closeButton = screen.getByLabelText('Close the webchat')
    const link1 = screen.getByText('sign up for flood warnings')
    const link2 = screen.getByText('manage your flood warnings account')
    const link3 = screen.getByText('report a flood')
    const button = screen.getByText('Continue')
    const link4 = screen.getByText('Find out more about call charges')

    // have to shift twice here. This isn't the case manually
    await user.tab({ shift: true })
    await user.tab({ shift: true })

    expect(link4).toHaveFocus()

    await user.tab({ shift: true })
    expect(button).toHaveFocus()

    await user.tab({ shift: true })
    expect(link3).toHaveFocus()

    await user.tab({ shift: true })
    expect(link2).toHaveFocus()

    await user.tab({ shift: true })
    expect(link1).toHaveFocus()

    await user.tab({ shift: true })
    expect(closeButton).toHaveFocus()

    await user.tab({ shift: true })
    expect(link4).toHaveFocus()
  })
})

describe('<Panel /> screens', () => {
  it('should go back a screen', () => {
    render(
      <Panel />
    )

    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Back'))

    expect(screen.getByText('What you can use webchat for')).toBeTruthy()
  })

  it('should default to the pre-chat screen', () => {
    render(
      <Panel />
    )

    expect(screen.getByText('What you can use webchat for')).toBeTruthy()
  })

  it('should recover a thread when a threadId exists', () => {
    mocks.useApp.mockReturnValue({ ...useAppMock, threadId: 'thread_123' })

    render(
      <Panel />
    )

    expect(mocks.useChatSdk().recoverThread).toHaveBeenCalled()
  })
})
