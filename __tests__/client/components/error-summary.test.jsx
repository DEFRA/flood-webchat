import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ErrorSummary } from '../../../src/client/components/errorSummary/error-summary'

describe('<ErrorSummary />', () => {
  it('should not render errors', () => {
    const errors = {}

    const { container } = render(<ErrorSummary errors={errors} />)

    expect(container.querySelector('.govuk-error-summary')).toBeFalsy()
  })

  it('should render errors', () => {
    const errors = {
      name: 'Your name is invalid',
      question: 'Your question is invalid'
    }

    const { container } = render(<ErrorSummary errors={errors} />)

    expect(container.querySelector('.govuk-error-summary')).toBeTruthy()
    expect(screen.getByText('Your name is invalid')).toBeTruthy()
    expect(screen.getByText('Your question is invalid')).toBeTruthy()
  })
})
