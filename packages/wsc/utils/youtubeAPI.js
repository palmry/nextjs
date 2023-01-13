const { sendRequest } = require('../../bin/utils')

const YOUTUBE_URL = 'https://www.youtube.com'

async function getEmbedData(url) {
  const fullUrl = `${YOUTUBE_URL}/oembed?url=${url}`
  const onRetryFunc = error => {
    console.error(`A problem occur when try to fetch to ${fullUrl}`)
  }
  const onReachMaximumRetry = error => {
    console.error(`Stop retry to fetch ${fullUrl}`)
  }
  return await sendRequest({ method: 'get', url: fullUrl }, onRetryFunc, onReachMaximumRetry, 2)
}

module.exports = {
  getEmbedData,
}
