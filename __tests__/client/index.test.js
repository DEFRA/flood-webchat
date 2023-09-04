import * as webchat from '../../src/client/index.js'
import Webchat from '../../src/client/lib/webchat.js'

jest.mock('../../src/client/lib/webchat.js')

const mocks = {
  Webchat: jest.mocked(Webchat)
}

describe('init()', () => {
  it('should return an instance of Webchat constructed with the provided args', () => {
    // Arrange
    const id = 'some-id'
    const options = {
      brandId: 'some brand ID',
      channelId: 'some channel ID',
      environmentName: 'UK1',
      availabilityEndpoint: '/webchat-availability'
    }

    // Act
    const actual = webchat.init(id, options)

    // Assert
    expect(actual).toBeInstanceOf(mocks.Webchat)
    expect(mocks.Webchat).toBeCalledWith(id, options)
  })
})
