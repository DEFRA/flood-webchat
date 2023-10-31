import React from 'react'
import { userEvent } from '@testing-library/user-event'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { RequestChat } from '../../../src/client/components/screens/request-chat'
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

const mocks = {
  useApp: jest.mocked(useApp),
  useChatSdk: jest.mocked(useChatSdk)
}

mocks.useApp.mockReturnValue({
  sdk: jest.mocked({
    authorize: jest.fn(),
    getCustomer: function () {
      this.setName = jest.fn()
      return this
    }
  }),
  setCustomerId: jest.fn(),
  setThreadId: jest.fn(),
  setChatRequested: jest.fn(),
  setThread: jest.fn()
})

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

const onForward = jest.fn()

describe('<RequestChat />', () => {
  let container

  beforeEach(() => {
    const result = render(<RequestChat onForward={onForward} onBack={jest.fn()} />)
    container = result.container
  })

  it('should render the screen', () => {
    expect(screen.getByText('Your name and question')).toBeTruthy()
  })

  it('should show the error summary when no inputs have been filled', () => {
    fireEvent.click(screen.getByText('Request chat'))

    expect(screen.getByText('There is a problem')).toBeTruthy()
    expect(container.querySelector('.govuk-error-summary')).toBeTruthy()
    expect(container.querySelector('.govuk-error-summary__list')).toBeTruthy()
    expect(container.querySelectorAll('.govuk-error-summary__list li')[0].textContent).toEqual('Enter your name')
    expect(container.querySelectorAll('.govuk-error-summary__list li')[1].textContent).toEqual('Enter your question')
  })

  it('should update the question characters remaining hint text', () => {
    const hint = container.querySelector('.govuk-hint')
    const textarea = container.querySelector('textarea')

    expect(hint.textContent).toEqual('You have 500 characters remaining')

    fireEvent.change(textarea, { target: { value: 'input' } })

    expect(hint.textContent).toEqual('You have 495 characters remaining')
  })

  it('should show question length error', () => {
    const textarea = container.querySelector('textarea')

    fireEvent.change(textarea, { target: { value: 'input'.repeat(101) } })
    fireEvent.click(screen.getByText('Request chat'))

    expect(container.querySelectorAll('.govuk-error-summary__list li')[1].textContent).toEqual('Your question must be 500 characters or less')
    expect(container.querySelector('.govuk-hint').textContent).toEqual('You have 5 characters too many')
  })

  it('should submit the message', async () => {
    const input = container.querySelector('form input')
    const textarea = container.querySelector('form textarea')
    const button = container.querySelector('form button')

    const user = userEvent.setup()

    fireEvent.change(input, { target: { value: 'name' } })
    fireEvent.change(textarea, { target: { value: 'question' } })

    await user.click(button)

    expect(onForward).toHaveBeenCalled()
  })
})
