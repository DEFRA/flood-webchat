import * as floodWebchat from '../../src/client/index.js'

const webchatInitRetVal = floodWebchat.init(true)
console.log(`webchatInitRetVal = ${webchatInitRetVal}`)

try {
  const res = await fetch('/foo?foo=bar')
  if (!res.ok) throw new Error(res.statusText)
  const text = await res.text()
  console.log(`serverside result 'bar' === 'bar' = ${text}`)
} catch (err) {
  console.error(err)
}
