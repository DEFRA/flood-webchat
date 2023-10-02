import React from 'react'
import { render, screen } from '@testing-library/react'

import { PanelHeader } from '../../../src/client/components/panel/panel-header'

const onBack = jest.fn()
const onClose = jest.fn()

describe('<PanelHeader />', () => {
  it('should render the close webchat button and no "back" button', () => {
    const { container } = render(
      <PanelHeader screen={0} onBack={onBack} onClose={onClose} />
    )

    expect(screen.getByLabelText('Close the webchat')).toBeTruthy()
    expect(container.querySelector('.govuk-back-link')).toBeFalsy()
  })

  it('should render the minimise webchat button', () => {
    render(
      <PanelHeader screen={0} onBack={onBack} onClose={onClose} isConnected />
    )

    expect(screen.getByLabelText('Minimise the webchat')).toBeTruthy()
  })

  it('should render the back button', () => {
    const { container } = render(
      <PanelHeader screen={1} onBack={onBack} onClose={onClose} />
    )

    expect(container.querySelector('.govuk-back-link')).toBeTruthy()
  })
})
