import '../../methods.mock'
import React, { useContext, useEffect } from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { AppContext, AppProvider } from '../../../../src/client/store/app/AppProvider'

const mocks = {
  location: {
    ...window.location,
    hash: '#webchat'
  }
}

describe('<AppProvider />', () => {
  const realLocation = window.location

  beforeAll(() => {
    delete window.location

    window.location = mocks.location
  })

  afterAll(() => {
    window.location = realLocation
    jest.clearAllMocks()
  })

  it('should show chat panel when #webchat hash is in the url', () => {
    const Component = () => {
      const context = useContext(AppContext)

      return (
        <div id='is-open'>{context.isChatOpen.toString()}</div>
      )
    }

    const { container } = render(
      <AppProvider availability='AVAILABLE'>
        <Component />
      </AppProvider>
    )

    expect(window.location.hash).toEqual('#webchat')
    expect(container.querySelector('#is-open').textContent).toEqual('true')
  })

  it('should toggle isKeyboard state based on events', () => {
    const Component = () => {
      const context = useContext(AppContext)

      useEffect(() => {
        const keydownEvent = new Event('keydown')
        document.dispatchEvent(keydownEvent)

        const pointerdownEvent = new Event('pointerdown')
        document.dispatchEvent(pointerdownEvent)
      }, [])

      return (
        <div id='is-keyboard'>{context.isKeyboard.toString()}</div>
      )
    }

    const { container } = render(
      <AppProvider availability='AVAILABLE'>
        <Component />
      </AppProvider>
    )

    // Expect the state to be toggled based on the events
    expect(container.querySelector('#is-keyboard').textContent).toEqual('false')
  })
})
