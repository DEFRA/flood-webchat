import '../methods.mock'
import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { LiveRegion } from '../../../src/client/components/live-region'
import { useApp } from '../../../src/client/store/useApp'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')

const mocks = {
  useApp: jest.mocked(useApp)
}

describe('<LiveRegion />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  mocks.useApp.mockReturnValue({
    setLiveRegionText: jest.fn(),
    agentStatus: 'new',
    liveRegionText: null
  })

  it('should render the live regions', () => {
    const { container } = render(<LiveRegion />)

    expect(container.querySelectorAll('.wc-live').length).toEqual(2)
  })

  it('should show text in the first live region', async () => {
    mocks.useApp.mockReturnValue({
      setLiveRegionText: jest.fn(),
      agentStatus: 'new',
      liveRegionText: 'message from jest'
    })

    const container = render(<LiveRegion />).container

    jest.advanceTimersByTime(4000)

    await waitFor(() => {
      expect(container.querySelectorAll('.wc-live')[0].innerHTML).toEqual('message from jest')
      expect(container.querySelectorAll('.wc-live')[1].innerHTML).toEqual('')
    })
  })
})
