const {
  sendRequest,
  defaultOnRetry,
  onRetryTimeoutWihoutTerminateProcess,
} = require('../../bin/utils')

const FACEBOOK_PLUGIN_URL = 'https://www.facebook.com/plugins'

async function getPostEmbedData(url) {
  return await sendRequest(
    {
      method: 'get',
      url: `${FACEBOOK_PLUGIN_URL}/post/oembed.json/?url=${url}`,
    },
    defaultOnRetry,
    onRetryTimeoutWihoutTerminateProcess
  )
}

async function getVideoEmbedData(url, retry = 3) {
  return await sendRequest(
    {
      method: 'get',
      url: `${FACEBOOK_PLUGIN_URL}/video/oembed.json/?url=${url}`,
    },
    defaultOnRetry,
    onRetryTimeoutWihoutTerminateProcess
  )
}

module.exports = {
  getPostEmbedData,
  getVideoEmbedData,
}
