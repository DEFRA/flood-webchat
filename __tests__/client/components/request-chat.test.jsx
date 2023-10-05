import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { RequestChat } from '../../../src/client/components/screens/request-chat'

const onBack = jest.fn()

describe('<RequestChat />', () => {
  let container

  beforeEach(() => {
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
})
