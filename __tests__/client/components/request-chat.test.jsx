import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { RequestChat } from '../../../src/client/components/screens/request-chat'
import { useApp } from '../../../src/client/store/AppProvider'
import { useCXOne } from '../../../src/client/lib/useCXOne'

jest.mock('../../../src/client/store/AppProvider')
jest.mock('../../../src/client/lib/useCXOne')

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({
  ChatSdk: function () {
    this.onChatEvent = jest.fn()
  },
  ChatEvent: {
    LIVECHAT_RECOVERED: true,
    MESSAGE_CREATED: true,
    AGENT_TYPING_STARTED: true,
    AGENT_TYPING_ENDED: true,
    MESSAGE_SEEN_BY_END_USER: true,
    ASSIGNED_AGENT_CHANGED: true,
    CONTACT_CREATED: true,
    CONTACT_STATUS_CHANGED: true
  }
}))

const mocks = {
  useApp: jest.mocked(useApp),
  useCXOne: jest.mocked(useCXOne)
}

const onBack = jest.fn()

describe('<RequestChat />', () => {
  let container

  beforeEach(() => {
    mocks.useApp.mockReturnValue({
      sdk: jest.mocked({
        authorize: jest.fn(),
        getThread: jest.fn('thread_123')
      })
    })

    mocks.useCXOne.mockReturnValue({
      getThread: jest.fn(),
      getCustomerId: jest.fn()
    })

    const result = render(<RequestChat onBack={onBack} />)

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

  it('should submit the message', () => {
    const input = container.querySelector('input')
    const textarea = container.querySelector('textarea')
    const button = container.querySelector('button')

    fireEvent.change(input, { target: { value: 'name' } })
    fireEvent.change(textarea, { target: { value: 'question' } })

    fireEvent.submit(button)

    console.log(mocks.useCXOne.mock.calls[0][0])

    // expect(mocks.useCXOne.getCustomerId).toBeCalled()
    expect(mocks.useCXOne.mock.calls[0][0].getThread).toBeCalled()
  })
})
