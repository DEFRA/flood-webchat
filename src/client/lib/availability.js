import nunjucks from './nunjucks.js'

const openBtn = 'data-wc-open-btn'

class Availability {
  constructor (id, openChatCb) {
    // Set availability container
    this.container = document.getElementById(id)

    // Events
    document.addEventListener('click', e => {
      if (e.target.hasAttribute(openBtn)) {
        console.log('click', e.target.id)
        openChatCb(e, e.target.id)
      }
    })
    document.addEventListener('keydown', e => {
      if (e.key === ' ' && e.target.hasAttribute(openBtn)) {
        e.preventDefault()
      }
    })
    document.addEventListener('keyup', e => {
      if (e.key === ' ' && e.target.hasAttribute(openBtn)) {
        openChatCb(e, e.target.id)
      }
    })
  }

  update (state) {
    console.log('availability.update()')

    const container = this.container
    const isText = !container.hasAttribute('data-wc-no-text')
    const hasThread = state.hasThread
    const isLink = hasThread || (isText && state.availability === 'AVAILABLE')
    const btnText = hasThread ? 'Show chat' : 'Start chat'

    // Update container
    container.innerHTML = nunjucks.render('availability.html', {
      model: {
        isText,
        isLink,
        btnText,
        availability: state.availability,
        unseen: state.unseen
      }
    })

    // Conditionally reinstate focus after dom replacement
    const link = container.querySelector('[data-wc-open-btn]')
    const hasFocus = document.activeElement.hasAttribute(openBtn)
    if (hasFocus && link) {
      link.focus()
    }
  }

  scroll (state) {
    const container = this.container
    const link = container.querySelector('[data-wc-link]')
    if (!link) {
      return
    }

    // Calculate offset
    const rect = container.getBoundingClientRect()
    const isBelowFold = rect.top + 35 > (window.innerHeight || document.documentElement.clientHeight)

    // Toggle static/sticky display
    const isHidden = (state.view === 'OPEN' || state.view === 'END') && !state.isOpen
    const isFixed = isHidden && isBelowFold
    document.documentElement.classList.toggle('wc-scroll-padding', isFixed)
    document.body.classList.toggle('wc-scroll-padding', isFixed)
    link.classList.toggle('wc-link--fixed', isFixed)
  }
}

export default Availability
