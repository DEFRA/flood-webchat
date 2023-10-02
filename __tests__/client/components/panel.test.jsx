import React from 'react'
import { userEvent } from '@testing-library/user-event'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Panel } from '../../../src/client/components/panel/panel'

describe('<Panel />', () => {
  let container

  beforeEach(() => {
    const result = render(
      <>
        <a href='#' className='wc-availability__link'>Start Chat</a>
        <div id='wc-panel'>
          <Panel screenNumber={0} />
        </div>
      </>
    )

    container = result.container
  })

  it('should render the panel title', () => {
    expect(screen.getByText('Floodline Webchat')).toBeTruthy()
  })

  it('should render panel close button', () => {
    expect(screen.getByLabelText('Close the webchat')).toBeTruthy()
  })

  it('should add [aria-hidden="true"] to <body> child elements', () => {
    expect(container.getAttribute('aria-hidden')).toEqual('true')
  })

  it('should focus elements within the webchat when tab targeting and return to the top after the last element has been focused', async () => {
    const user = userEvent.setup()

    const closeButton = screen.getByLabelText('Close the webchat')
    const link1 = screen.getByText('sign up for flood warnings')
    const link2 = screen.getByText('manage your flood warnings account')
    const link3 = screen.getByText('report a flood')
    const button = screen.getByText('Continue')
    const link4 = screen.getByText('Find out more about call charges')

    await user.tab()
    expect(closeButton).toHaveFocus()

    await user.tab()
    expect(link1).toHaveFocus()

    await user.tab()
    expect(link2).toHaveFocus()

    await user.tab()
    expect(link3).toHaveFocus()

    await user.tab()
    expect(button).toHaveFocus()

    await user.tab()
    expect(link4).toHaveFocus()

    await user.tab()
    expect(closeButton).toHaveFocus()
  })

  it('should focus the elements, in reverse-order, within the webchat when shift-tab targeting and return to the bottom after the first element has been focused', async () => {
    const user = userEvent.setup()

    const closeButton = screen.getByLabelText('Close the webchat')
    const link1 = screen.getByText('sign up for flood warnings')
    const link2 = screen.getByText('manage your flood warnings account')
    const link3 = screen.getByText('report a flood')
    const button = screen.getByText('Continue')
    const link4 = screen.getByText('Find out more about call charges')

    // have to shift twice here. This isn't the case manually
    await user.tab({ shift: true })
    await user.tab({ shift: true })

    expect(link4).toHaveFocus()

    await user.tab({ shift: true })
    expect(button).toHaveFocus()

    await user.tab({ shift: true })
    expect(link3).toHaveFocus()

    await user.tab({ shift: true })
    expect(link2).toHaveFocus()

    await user.tab({ shift: true })
    expect(link1).toHaveFocus()

    await user.tab({ shift: true })
    expect(closeButton).toHaveFocus()

    await user.tab({ shift: true })
    expect(link4).toHaveFocus()
  })
})

describe('<Panel /> screens', () => {
  it('should show back link on the next screen', () => {
    render(
      <>
        <a href='#' className='wc-availability__link'>Start Chat</a>
        <div id='wc-panel'>
          <Panel screenNumber={1} />
        </div>
      </>
    )

    expect(screen.getByText('Back')).toBeTruthy()
  })

  it('should go back a screen', () => {
    render(
      <>
        <a href='#' className='wc-availability__link'>Start Chat</a>
        <div id='wc-panel'>
          <Panel screenNumber={1} />
        </div>
      </>
    )

    fireEvent.click(screen.getByText('Back'))

    expect(screen.getByText('What you can use webchat for')).toBeTruthy()
  })

  it('should default to the pre-chat screen', () => {
    render(
      <>
        <a href='#' className='wc-availability__link'>Start Chat</a>
        <div id='wc-panel'>
          <Panel />
        </div>
      </>
    )

    expect(screen.getByText('What you can use webchat for')).toBeTruthy()
  })
})