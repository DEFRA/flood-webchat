import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Unavailable } from '../../../src/client/components/screens/unavailable'
import { useApp } from '../../../src/client/store/useApp'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')

const mocks = {
  useApp: jest.mocked(useApp)
}

describe('<Unavailable />', () => {
  mocks.useApp.mockReturnValue({
    availability: 'UNAVAILABLE'
  })

  it('should render the screen', () => {
    render(<Unavailable />)

    expect(screen.getByText('Webchat is currently not available')).toBeTruthy()
  })
})
