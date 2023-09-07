import Utils from './utils.js'

class State {
  constructor (openChat, closeChat) {
    const threadId = window.localStorage.getItem('THREAD_ID')
    const isBack = window.sessionStorage.getItem('IS_BACK') === 'true'
    const isOpen = window.location.hash === '#webchat'
    const view = threadId ? 'OPEN' : null

    // Settings
    const settings = window.localStorage.getItem('SETTINGS')
    const hasAudio = settings ? settings.split(',')[0] : true
    const isScroll = settings ? settings.split(',')[1] : true

    // Public properties
    this.threadId = threadId
    this.availability = null
    this.status = null
    this.view = view
    this.assignee = null
    this.unseen = 0
    this.isAuthorised = false
    this.hasAudio = hasAudio
    this.isScroll = isScroll
    this.isMobile = true
    this.isBack = isBack
    this.isOpen = isOpen
    this.messages = []
    this.name = null
    this.question = null

    // Private methods (callbacks)
    this._openChat = openChat
    this._closeChat = closeChat

    // Help with browser back behaviour
    if (window.history.length <= 1) {
      this._isBack = false
      window.sessionStorage.removeItem('IS_BACK')
    }

    // We need to toggle some attributes depending on screen size
    Utils.listenForDevice('mobile', (isMobile) => { this.isMobile = isMobile })

    // Events
    window.addEventListener('popstate', this._popstate.bind(this))
  }

  _popstate (e) {
    if (window.location.hash === '#webchat') {
      this._openChat(e)
    } else {
      this._closeChat(e)
    }
  }

  replaceState () {
    this.isOpen = false
    const url = window.location.href.split('#')[0]
    window.history.replaceState(null, null, url)
  }

  pushState () {
    this._isOpen = true
    this._isBack = true
    const url = `${window.location.href.split('#')[0]}#webchat`
    window.history.pushState({ view: 'webchat', isBack: true }, '', url)
    window.sessionStorage.setItem('IS_BACK', true)
  }

  back () {
    const offsetY = window.scrollY
    window.history.back()
    if (!this._isMobile) {
      window.addEventListener('scroll', e => {
        window.scrollTo(0, offsetY)
      }, { once: true })
    }
  }
}

export default State