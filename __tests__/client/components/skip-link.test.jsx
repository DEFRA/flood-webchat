import '../methods.mock'
import React from 'react'
import { render } from '@testing-library/react'
import { SkipLink } from '../../../src/client/components/skip-link'
import { useApp } from '../../../src/client/store/useApp'

jest.mock('@nice-devone/nice-cxone-chat-web-sdk', () => ({}))
jest.mock('../../../src/client/store/useApp')

const mocks = {
  useApp: jest.mocked(useApp)
}

describe('SkipLink Component', () => {
  it('does not render Skip to webchat link when no target container found', () => {
    mocks.useApp.mockReturnValue({
      thread: { thread: 'mockThreadValue' }
    })

    render(<SkipLink />)

    expect(document.body.innerHTML).toMatch('<div></div>')
  })

  it('does not render Skip to webchat link when thread is falsy', () => {
    mocks.useApp.mockReturnValue({
    })

    const { queryByText } = render(<SkipLink />)

    const skipToWebchatLink = queryByText('Skip to webchat')
    expect(skipToWebchatLink).toBeNull()
  })

  it('renders Skip to webchat link when thread is truthy', () => {
    mocks.useApp.mockReturnValue({
      thread: { thread: 'mockThreadValue' }
    })

    const targetContainer = document.createElement('div')
    targetContainer.id = 'skip-links'
    document.body.appendChild(targetContainer)

    render(<SkipLink />)

    const expectedHTML = '<a href="#webchat" class="govuk-skip-link" data-module="govuk-skip-link" data-wc-skiplink="true" data-wc-open-btn="true">Skip to webchat</a>'
    expect(document.body.innerHTML).toContain(expectedHTML)
  })
})
