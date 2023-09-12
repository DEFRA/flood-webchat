export default class Notification {
  constructor (url) {
    this._url = url

    // Create context
    const context = new (window.AudioContext || window.webkitAudioContext)()
    // context.addEventListener('statechange', () => {
    //   console.log('Audio: ', context.state)
    // })
    this._context = context

    // Unlock audio
    this._unlockAudioContext()

    // Load buffer
    this._init(url)
  }

  _init () {
    const context = this._context
    const url = this._url

    fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => context.decodeAudioData(buffer))
      .then(decodedData => {
        this._buffer = decodedData
      })
      .catch(console.error)
  }

  _unlockAudioContext () {
    const context = this._context
    if (context.state === 'suspended') {
      const events = ['touchstart', 'touchend', 'mousedown', 'wheel', 'keydown', 'click']
      const unlock = _e => {
        events.forEach(event => {
          document.body.removeEventListener(event, unlock)
        })
        context.resume()
      }
      events.forEach(event => {
        document.body.addEventListener(event, unlock, false)
      })
    }
  }

  playSound () {
    const context = this._context
    const buffer = this._buffer
    console.log('Play sound (context state: ', context.state, ')')

    // Create source
    const source = context.createBufferSource()
    source.buffer = buffer
    source.connect(context.destination)
    source.start()
  }
}
