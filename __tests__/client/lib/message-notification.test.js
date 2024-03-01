import { messageNotification } from '../../../src/client/lib/message-notification'

const mocks = {
  fetch: jest.fn(() =>
    Promise.resolve({
      arrayBuffer: () => Promise.resolve({})
    })
  ),
  addEventListener: jest.fn(),
  resume: jest.fn(),
  decodeAudioData: jest.fn(),
  createBufferSource: jest.fn().mockReturnValue({
    connect: jest.fn(),
    start: jest.fn()
  }),
  AudioContext: jest.fn()
    .mockImplementationOnce(() => ({
      state: 'suspended',
      resume: mocks.resume,
      decodeAudioData: mocks.decodeAudioData,
      createBufferSource: mocks.createBufferSource
    }))
    .mockImplementationOnce(() => ({
      state: 'running',
      decodeAudioData: mocks.decodeAudioData,
      createBufferSource: mocks.createBufferSource
    }))
}

describe('message-notification', () => {
  const realFetch = window.fetch
  const realAudioContext = window.AudioContext
  const realAddEventListener = document.body.addEventListener

  beforeAll(() => {
    window.fetch = mocks.fetch
    window.AudioContext = mocks.AudioContext
    document.body.addEventListener = mocks.addEventListener
  })

  afterAll(() => {
    window.fetch = realFetch
    window.AudioContext = realAudioContext
    document.body.addEventListener = realAddEventListener

    jest.clearAllMocks()
  })

  it('should unlock AudioContext', async () => {
    await messageNotification('/audio.mp3')

    expect(mocks.addEventListener).toHaveBeenCalledTimes(6)
  })

  it('should play sound', async () => {
    const playSound = await messageNotification('/audio.mp3')
    playSound()

    expect(mocks.fetch).toHaveBeenCalled()
    expect(mocks.createBufferSource).toHaveBeenCalled()
    expect(mocks.createBufferSource().start).toHaveBeenCalled()
    expect(mocks.createBufferSource().connect).toHaveBeenCalled()
  })
})
