import React from 'react'
import { userEvent } from '@testing-library/user-event'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { RequestChat } from '../../../src/client/components/screens/request-chat'
import { useApp } from '../../../src/client/store/useApp'
import { useChatSdk } from '../../../src/client/store/useChatSdk'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')
jest.mock('../../../src/client/store/useChatSdk')

const mocks = {
  useApp: jest.mocked(useApp),
  useChatSdk: jest.mocked(useChatSdk)
}

describe('<RequestChat />', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should render the screen', () => {
    mocks.useApp.mockReturnValue({
      sdk: jest.fn()
    })

    mocks.useChatSdk.mockReturnValue({
      fetchCustomerId: jest.fn(),
      fetchThread: jest.fn()
    })

    render(
      <RequestChat onBack={jest.fn()} />
    )

    expect(screen.getByText('Your name and question')).toBeTruthy()
  })

  it('should show the error summary when no inputs have been filled', () => {
    mocks.useChatSdk.mockReturnValue({
      fetchCustomerId: jest.fn(),
      fetchThread: jest.fn()
    })

    const { container } = render(
      <RequestChat onBack={jest.fn()} />
    )

    fireEvent.click(screen.getByText('Request chat'))

    expect(screen.getByText('There is a problem')).toBeTruthy()
    expect(container.querySelector('.govuk-error-summary')).toBeTruthy()
    expect(container.querySelector('.govuk-error-summary__list')).toBeTruthy()
    expect(container.querySelectorAll('.govuk-error-summary__list li')[0].textContent).toEqual('Enter your name')
    expect(container.querySelectorAll('.govuk-error-summary__list li')[1].textContent).toEqual('Enter your question')
  })

  it('should update the question characters remaining hint text', () => {
    mocks.useChatSdk.mockReturnValue({
      fetchCustomerId: jest.fn(),
      fetchThread: jest.fn()
    })

    const { container } = render(
      <RequestChat onBack={jest.fn()} />
    )

    const hint = container.querySelector('.govuk-hint')
    const textarea = container.querySelector('textarea')

    expect(hint.textContent).toEqual('You have 500 characters remaining')

    fireEvent.change(textarea, { target: { value: 'input' } })

    expect(hint.textContent).toEqual('You have 495 characters remaining')
  })

  it('should show question length error', () => {
    mocks.useApp.mockReturnValue({
      sdk: jest.fn()
    })

    mocks.useChatSdk.mockReturnValue({
      fetchCustomerId: jest.fn(),
      fetchThread: jest.fn()
    })

    const { container } = render(
      <RequestChat onBack={jest.fn()} />
    )

    const textarea = container.querySelector('textarea')

    fireEvent.change(textarea, { target: { value: 'input'.repeat(101) } })
    fireEvent.click(screen.getByText('Request chat'))

    expect(container.querySelectorAll('.govuk-error-summary__list li')[1].textContent).toEqual('Your question must be 500 characters or less')
    expect(container.querySelector('.govuk-hint').textContent).toEqual('You have 5 characters too many')
  })

  it('should focus the input when the error is clicked', () => {
    mocks.useApp.mockReturnValue({
      sdk: jest.fn()
    })

    mocks.useChatSdk.mockReturnValue({
      fetchCustomerId: jest.fn(),
      fetchThread: jest.fn()
    })

    const { container } = render(
      <RequestChat />
    )

    fireEvent.click(screen.getByText('Request chat'))
    fireEvent.click(container.querySelector('a[data-key="name"]'))

    expect(container.querySelector('.govuk-error-summary')).toBeTruthy()
    expect(container.querySelector('input')).toHaveFocus()
  })

  it('should submit the message', async () => {
    mocks.useApp.mockReturnValue({
      sdk: ({
        getCustomer: jest.fn().mockReturnValue({
          setName: jest.fn()
        })
      }),
      setCustomerId: jest.fn(),
      setThreadId: jest.fn(),
      setThread: jest.fn()
    })

    mocks.useChatSdk.mockReturnValue({
      fetchCustomerId: jest.fn(),
      fetchThread: () => ({
        startChat: jest.fn
      })
    })

    const { container } = render(
      <RequestChat onBack={jest.fn()} />
    )

    const input = container.querySelector('form input')
    const textarea = container.querySelector('form textarea')
    const button = container.querySelector('form button')

    const user = userEvent.setup()

    fireEvent.change(input, { target: { value: 'name' } })
    fireEvent.change(textarea, { target: { value: 'question' } })

    await user.click(button)

    expect(mocks.useApp().setCustomerId).toHaveBeenCalled()
    expect(mocks.useApp().setThreadId).toHaveBeenCalled()
    expect(mocks.useApp().setThread).toHaveBeenCalled()
  })
})
