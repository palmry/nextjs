import axios from 'axios'
import 'regenerator-runtime/runtime'
import { sendRequest, RETRY_DELAY, RETRY_TIME } from './utils'

jest.mock('axios')

const AXIOS_SETTINGS = { method: 'GET', url: 'https://www.google.com' }

describe('sendRequest', () => {
  test('Test success request', async () => {
    const onRetry = jest.fn()
    const onRetryTimeout = jest.fn()
    axios.mockResolvedValue({ data: { message: 'Success' } })
    await sendRequest(AXIOS_SETTINGS, onRetry, onRetryTimeout)
    expect(onRetry).not.toHaveBeenCalled()
    expect(onRetryTimeout).not.toHaveBeenCalled()
  })

  test('Test retry case', async () => {
    const onRetry = jest.fn()
    const onRetryTimeout = jest.fn()
    // Mock console.log() to check the message
    console.log = jest.fn()
    jest.setTimeout(10000)
    // Mock axios to force it returns a response with error status
    axios.mockImplementation(() =>
      Promise.reject({ response: { status: 429, statusText: 'Too Many Requests' } })
    )
    await sendRequest(AXIOS_SETTINGS, onRetry, onRetryTimeout)

    expect(onRetry).toHaveBeenCalledTimes(5)
    expect(onRetryTimeout).toHaveBeenCalledTimes(1)

    for (let index = 0; index < RETRY_TIME; index++) {
      const expectedDelay = Math.pow(2, index + 1) * RETRY_DELAY
      expect(console.log.mock.calls[index][0]).toBe(`Wait ${expectedDelay}ms ...`)
    }
  })
})
