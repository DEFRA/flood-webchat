import React from 'react'
import { render, screen } from '@testing-library/react'

import { PanelHeader } from '../../../src/client/components/panel/panel-header'
import { useApp } from '../../../src/client/store/AppProvider.jsx'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => {})
jest.mock('../../../src/client/store/AppProvider.jsx')

const mocks = {
  useApp: jest.mocked(useApp)
}

mocks.useApp.mockReturnValue({
  thread: {},
  setChatVisibility: jest.fn()
})

describe('<PanelHeader />', () => {
  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should render the close webchat button and no "back" button', () => {
    mocks.useApp.mockReturnValueOnce({ thread: null })

    const { container } = render(
      <PanelHeader />
    )

    expect(screen.getByLabelText('Close the webchat')).toBeTruthy()
    expect(container.querySelector('.govuk-back-link')).toBeFalsy()
  })

  it('should render the minimise webchat button', () => {
    render(
      <PanelHeader onBack={jest.fn()} />
    )

    expect(screen.getByLabelText('Minimise the webchat')).toBeTruthy()
  })

  it('should render the back button', () => {
    mocks.useApp.mockReturnValueOnce({ thread: null })

    const { container } = render(
      <PanelHeader onBack={jest.fn()} />
    )

    expect(container.querySelector('.govuk-back-link')).toBeTruthy()
  })
})
