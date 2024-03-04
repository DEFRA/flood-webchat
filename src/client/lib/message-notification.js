export const messageNotification = async audioUrl => {
  const context = new (window.AudioContext || window.webkitAudioContext)()

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

  const response = await fetch(audioUrl)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = await context.decodeAudioData(arrayBuffer)

  return () => {
    const source = context.createBufferSource()
    source.buffer = buffer
    source.connect(context.destination)
    source.start()
  }
}
