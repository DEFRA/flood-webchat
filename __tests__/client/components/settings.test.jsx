import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Settings } from '../../../src/client/components/screens/settings'
import { useApp } from '../../../src/client/store/useApp'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')

const mocks = {
  useApp: jest.mocked(useApp),
  handleOnCancel: jest.fn()
}

describe('<Settings />', () => {
  it('should render the screen', () => {
    mocks.useApp.mockReturnValue({
      settings: {
        audio: false,
        scroll: false
      }
    })

    render(<Settings />)

    expect(screen.getByText('Change settings')).toBeTruthy()
  })

  it('should toggle the options: [on]', () => {
    mocks.useApp.mockReturnValue({
      settings: {
        audio: false,
        scroll: false
      }
    })

    const { container } = render(<Settings />)

    const audioElement = container.querySelector('#audio')
    const scrollElement = container.querySelector('#scroll')

    fireEvent.click(audioElement)
    fireEvent.click(scrollElement)

    expect(audioElement.checked).toEqual(true)
    expect(scrollElement.checked).toEqual(true)
  })

  it('should save settings', () => {
    mocks.useApp.mockReturnValue({
      setSettings: jest.fn(),
      settings: {
        audio: false,
        scroll: false
      }
    })

    const { container } = render(<Settings onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#settings-save')

    fireEvent.click(button)

    expect(mocks.useApp().setSettings).toHaveBeenCalled()
    expect(mocks.handleOnCancel).toHaveBeenCalled()
  })

  it('should cancel the screen', () => {
    mocks.useApp.mockReturnValue({
      settings: {
        audio: false,
        scroll: false
      }
    })

    const { container } = render(<Settings onCancel={mocks.handleOnCancel} />)

    const button = container.querySelector('#settings-cancel')

    fireEvent.click(button)

    expect(mocks.handleOnCancel).toHaveBeenCalled()
  })
})
