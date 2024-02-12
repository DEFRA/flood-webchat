import { agentStatusHeadline } from '../../../src/client/lib/agent-status-headline'

const mocks = {
  fetch: jest.fn()
}
describe('agent-status-headline', () => {
  beforeAll(() => {
    window.fetch = mocks.fetch
  })
  afterAll(() => {
    delete window.fetch
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return connecting headline when agentStatus is undefined and availability is undefined', () => {
    expect(agentStatusHeadline(undefined, undefined, undefined)).toEqual('Connecting to Floodline')
  })

  it('should return session ended by advisor when agentStatus is closed', () => {
    expect(agentStatusHeadline(undefined, 'closed', undefined)).toEqual('Session ended by advisor')
  })

  it('should return session ended by advisor when agentStatus is resolved', () => {
    expect(agentStatusHeadline(undefined, 'resolved', undefined)).toEqual('Session ended by advisor')
  })

  it('should return session ended by advisor with agent name when agentStatus is closed and agentName is provided', () => {
    expect(agentStatusHeadline(undefined, 'closed', 'Lee')).toEqual('Lee ended the session')
  })

  it('should return speaking with agent headline when agentStatus is true and agentName is provided', () => {
    expect(agentStatusHeadline(undefined, true, 'Bruno')).toEqual('You are speaking with Bruno')
  })

  it('should return no advisers currently available when agentStatus is true and agentName is not provided', () => {
    expect(agentStatusHeadline(undefined, true, undefined)).toEqual('No advisers currently available')
  })

  it('should return webchat is not currently available when availability is UNAVAILABLE', () => {
    expect(agentStatusHeadline('UNAVAILABLE', undefined, undefined)).toEqual('Webchat is not currently available')
  })
}
)
