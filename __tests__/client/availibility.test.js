import Availability from '../../src/client/lib/availability'

describe('Availability', () => {
  let availability
  let openChatCb

  beforeEach(() => {
    // Create a mock callback function
    openChatCb = jest.fn()

    // Create a container element
    const container = document.createElement('div')
    container.id = 'availability-container'
    document.body.appendChild(container)

    // Create an instance of Availability
    availability = new Availability('availability-container', openChatCb)
  })

  afterEach(() => {
    // Clean up the container element after each test
    document.body.removeChild(document.getElementById('availability-container'))
  })

  it('should handle click events', () => {
    const button = document.createElement('button')
    button.setAttribute('data-wc-open-btn', '')
    availability.container.appendChild(button)

    button.click()

    expect(openChatCb).toHaveBeenCalled()
  })
  it('should be instantiated', () => {
    expect(availability).toBeInstanceOf(Availability)
  })

  it('should have the start chat text', () => {
    const state = {
      hasThread: false,
      availability: 'AVAILABLE',
      unseen: 0
    }

    availability.update(state)

    // Assert that the container's HTML is updated
    const containerContent = availability.container.innerHTML
    expect(containerContent).toContain('Start chat')
  })
  it('should have the start chat text', () => {
    const state = {
      hasThread: false,
      availability: 'UNAVAILABLE',
      unseen: 0
    }

    availability.update(state)

    // Assert that the container's HTML is updated
    const containerContent = availability.container.innerHTML
    expect(containerContent).toContain('<p class="govuk-body">When it is available, a \'start chat\' link will appear.</p>')
  })
  it('should have the show chat text if has thread', () => {
    const state = {
      hasThread: true,
      availability: 'AVAILABLE',
      unseen: 2
    }

    availability.update(state)

    // Assert that the container's HTML is updated
    const containerContent = availability.container.innerHTML
    expect(containerContent).toContain('Show chat')
    expect(containerContent).toContain('<span class="wc-open-btn__unseen">2</span>')
  })
  it('should have the show chat text if has thread but the is no availibility', () => {
    const state = {
      hasThread: true,
      availability: 'UNAVAILABLE',
      unseen: 2
    }

    availability.update(state)

    // Assert that the container's HTML is updated
    const containerContent = availability.container.innerHTML
    expect(containerContent).toContain('Show chat')
    expect(containerContent).toContain('<span class="wc-open-btn__unseen">2</span>')
  })
})
