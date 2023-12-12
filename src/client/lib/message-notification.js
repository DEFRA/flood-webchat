export const messageNotification = (audioUrl) => {
  let buffer

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

  fetch(audioUrl)
    .then(response => response.arrayBuffer())
    .then(buffer => context.decodeAudioData(buffer))
    .then(decodedData => {
      buffer = decodedData
    })
    .catch(console.error)

  return () => {
    const source = context.createBufferSource()
    source.buffer = buffer
    source.connect(context.destination)
    source.start()
  }
}
