import { messageNotification } from '../../../src/client/lib/message-notification'

const mocks = {
  fetch: jest.fn(() =>
    Promise.resolve({
      arrayBuffer: () => Promise.resolve({})
    })
  ),
  resume: jest.fn(),
  decodeAudioData: jest.fn(),
  createBufferSource: jest.fn().mockReturnValue({
    connect: jest.fn(),
    start: jest.fn()
  }),
  AudioContext: jest.fn()
    .mockImplementation(() => ({
      state: 'suspended',
      resume: mocks.resume,
      decodeAudioData: mocks.decodeAudioData,
      createBufferSource: mocks.createBufferSource
    }))
    .mockImplementation(() => ({
      state: 'running',
      decodeAudioData: mocks.decodeAudioData,
      createBufferSource: mocks.createBufferSource
    }))
}

describe('message-notification', () => {
  const realFetch = window.fetch
  const realAudioContext = window.AudioContext

  beforeAll(() => {
    window.fetch = mocks.fetch
    window.AudioContext = mocks.AudioContext
  })

  afterAll(() => {
    window.fetch = realFetch
    window.AudioContext = realAudioContext

    jest.clearAllMocks()
  })

  it('should play sound', () => {
    const playSound = messageNotification('/audio.mp3')
    playSound()

    expect(mocks.fetch).toBeCalledTimes(1)
    expect(mocks.createBufferSource).toHaveBeenCalled()
    expect(mocks.createBufferSource().start).toHaveBeenCalled()
    expect(mocks.createBufferSource().connect).toHaveBeenCalled()
  })
})
