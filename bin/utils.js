/** ----------------------------------
 * UTILS FOR BUILDER FILE (ES5 ONLY)
 ---------------------------------- */
const path = require('path')
const axios = require('axios')
const get = require('lodash/get')

require('dotenv').config({
  path: path.resolve(process.cwd(), `./.env.${process.env.NODE_ENV}`),
})

const fs = require('fs')

const DEFAULT_FETCH_LIMIT = 1000

const RETRY_DELAY = 100
const RETRY_TIME = 5

/**
 * create file with given options
 * @param {string} filename
 * @param {*} data
 * @param {string} alias
 */
function writeFile(rootPath, filename, data, alias) {
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath, { recursive: true })
  }

  fs.writeFile(`${rootPath}/${filename}`, data, 'utf8', err => {
    if (err) throw err
    console.log(`${alias} exported`)
  })
}

/**
 * create fetch config with given url
 * @returns {Object}
 */
function getFetchOptions() {
  return {
    method: 'POST',
    url: `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_CONTENTFUL_SPACEID}/environments/${process.env.REACT_APP_CONTENTFUL_ENVIRONMENT}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_CONTENTFUL_API_ACCESSTOKEN}`,
    },
  }
}

/**
 * factory fn: recursive fetch all data from contentful
 * @param {string} queryName
 * @param {Function} queryStringFn
 * @param {number} [skip = 0]
 * @param {Object} [cache = []]
 * @returns {Array}
 */
async function fetchAllFactory(
  queryName,
  queryStringFn,
  limit = DEFAULT_FETCH_LIMIT,
  skip = 0,
  cache = []
) {
  const response = await sendRequest({
    ...getFetchOptions(),
    data: queryStringFn(skip),
  })

  const { items, total } = response.data.data[queryName]

  const nextSkip = skip + limit
  // case: if has more, then recursive this function
  if (skip < total) {
    console.log(`fetching ${queryName} ${skip} - ${skip + limit}`)
    return fetchAllFactory(queryName, queryStringFn, limit, nextSkip, [...cache, ...items])
  }

  // case: receive all posts
  return cache
}

function defaultOnRetry(error) {
  // capture contentful
  console.trace('Could not send a request...', error)
}

function defaultOnRetryTimeout(error) {
  // terminate process
  console.trace('The app will be terminated due to retry timeout by this error', error)
  process.exit(1)
}

function onRetryTimeoutWihoutTerminateProcess(error) {
  console.trace('Stop retry to send a request', error)
}

async function sendRequest(
  settings,
  onRetry = defaultOnRetry,
  onRetryTimeout = defaultOnRetryTimeout,
  retryTime = RETRY_TIME
) {
  let response = null
  let retryCount = 0
  let lastError = null
  do {
    try {
      response = await axios(settings)
      break
    } catch (error) {
      const delay = Math.pow(2, retryCount + 1) * RETRY_DELAY
      lastError = error
      onRetry(error)
      console.log(`Wait ${delay}ms ...`)
      await sleep(delay)
      retryCount++
    }
  } while (retryCount < retryTime)

  if (retryTime === retryCount) {
    onRetryTimeout(lastError)
  }

  return response
}

function dateTimeToEpoch(dateTimeStr) {
  return Math.round(new Date(dateTimeStr).getTime() / 1000)
}

// TODO: Currently, we cannot share this for all environments (Netlify functions, Node and React)
// Because it is using different version of ES to implement.
// We need to find the way to upgrade syntax to ES6 for Node environment
function isMultiLanguageSite(siteConfig) {
  return Object.keys(get(siteConfig, 'locales', {})).length > 1
}

/**
 * TODO: Refactor to use this function from lambda/utils/common.js
 * @param {number} [timeout=0] - How long does it sleep.
 * @returns {Object} - A Promise that can be waited by await syntax.
 */
function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

module.exports = {
  writeFile,
  getFetchOptions,
  fetchAllFactory,
  sendRequest,
  defaultOnRetry,
  defaultOnRetryTimeout,
  onRetryTimeoutWihoutTerminateProcess,
  DEFAULT_FETCH_LIMIT,
  dateTimeToEpoch,
  isMultiLanguageSite,
  RETRY_DELAY,
  RETRY_TIME,
}
