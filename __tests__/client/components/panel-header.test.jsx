import React from 'react'
import { render, screen } from '@testing-library/react'

import { PanelHeader } from '../../../src/client/components/panel/panel-header'
import { useApp } from '../../../src/client/store/AppProvider.jsx'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => {})
jest.mock('../../../src/client/store/AppProvider.jsx')

const onBack = jest.fn()
const onClose = jest.fn()

const mocks = {
  useApp: jest.mocked(useApp)
}

describe('<PanelHeader />', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the close webchat button and no "back" button', () => {
    mocks.useApp.mockReturnValue({ isCustomerConnected: false })

    const { container } = render(
      <PanelHeader />
    )

    expect(screen.getByLabelText('Close the webchat')).toBeTruthy()
    expect(container.querySelector('.govuk-back-link')).toBeFalsy()
  })

  it('should render the minimise webchat button', () => {
    mocks.useApp.mockReturnValue({ isCustomerConnected: true })

    render(
      <PanelHeader onBack={onBack} onClose={onClose} />
    )

    expect(screen.getByLabelText('Minimise the webchat')).toBeTruthy()
  })

  it('should render the back button', () => {
    mocks.useApp.mockReturnValue({ isCustomerConnected: false })

    const { container } = render(
      <PanelHeader onBack={onBack} onClose={onClose} />
    )

    expect(container.querySelector('.govuk-back-link')).toBeTruthy()
  })
})
