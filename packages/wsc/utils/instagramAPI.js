const {
  sendRequest,
  defaultOnRetry,
  onRetryTimeoutWihoutTerminateProcess,
} = require('../../bin/utils')

const INSTAGRAM_API_URL = 'https://api.instagram.com'

async function getEmbedData(url) {
  return await sendRequest(
    { method: 'get', url: `${INSTAGRAM_API_URL}/oembed?url=${url}` },
    defaultOnRetry,
    onRetryTimeoutWihoutTerminateProcess
  )
}

module.exports = {
  getEmbedData,
}
