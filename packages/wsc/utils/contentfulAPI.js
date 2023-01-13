const path = require('path')
const isEmpty = require('lodash/isEmpty')
const get = require('lodash/get')
const isArray = require('lodash/isArray')
const isObject = require('lodash/isObject')
const find = require('lodash/find')
const utils = require('../../bin/utils')

require('dotenv').config({
  path: path.resolve(process.cwd(), `./.env.${process.env.NODE_ENV}`),
})

const DEFAULT_FETCH_LIMIT = 1000
const DEFAULT_ASSET_FIELDS = ['featuredImage', 'socialImage', 'bannerImage', 'logo', 'image']
const CIRCULAR_RELATION_FIELDS = ['translatedPost', 'relatedContent', 'recommendedPosts']

const CONTENTFUL_ENVIRONMENT = process.env.REACT_APP_CONTENTFUL_ENVIRONMENT

const CONTENTFUL_REST_URL = `https://${process.env.REACT_APP_CONTENTFUL_API_HOST}/spaces/${process.env.REACT_APP_CONTENTFUL_SPACEID}/environments/${CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.REACT_APP_CONTENTFUL_API_ACCESSTOKEN}`

/**
 * convert contentful post response to graphql response format
 * @param {Object<string,any>|Object<string,any>[]} ctfPostResponse
 * @param {Object<string,any>|Object<string,any>[]} [ctfIncludedItems = []]
 * @param {Array<string>|Array<string>} [assetFields = []]
 * @returns {Object<string,any>|Object<string,any>[]|null}
 */
function convertContentfulEntryResponse(
  ctfPostResponse,
  ctfIncludedItems = [],
  assetFields = DEFAULT_ASSET_FIELDS,
  ignoreFields = CIRCULAR_RELATION_FIELDS
) {
  if (isEmpty(ctfPostResponse)) return ctfPostResponse

  const isInputArray = isArray(ctfPostResponse)
  const posts = isInputArray ? ctfPostResponse : [ctfPostResponse]
  // create new data format
  const formattedPosts = posts.map(item => {
    if (!item.sys) return item

    const { fields, sys } = item
    const contentfulId = get(sys, 'id')

    let convertedFields

    if (!isEmpty(fields)) {
      // handle field data in content type
      convertedFields = Object.entries(fields).reduce((rs, [key, value]) => {
        let formattedValue
        if (!ignoreFields.includes(key) && value && (isObject(value) || isArray(value))) {
          // recursive convert entry data
          formattedValue = convertContentfulEntryResponse(value, ctfIncludedItems)
        } else {
          formattedValue = value
        }

        return { ...rs, [key]: formattedValue }
      }, {})
    } else {
      // handle reference data in content type
      const referenceCtfObject = find(ctfIncludedItems, ({ sys }) => sys.id === contentfulId)
      convertedFields = convertContentfulEntryResponse(referenceCtfObject, ctfIncludedItems)
    }

    // flatten image field
    const convertedAssetsFields = assetFields.reduce((result, assetField) => {
      const asset = get(convertedFields, assetField)
      if (!asset) return result

      const newAssetData = { ...asset, ...asset.file }
      delete newAssetData['file']
      return { ...result, [assetField]: newAssetData }
    }, {})

    return {
      sys: {
        id: contentfulId,
        type: get(sys, 'type'),
        spaceId: get(sys, 'space.sys.id'),
        environmentId: get(sys, 'environment.sys.id'),
        updatedAt: get(sys, 'updatedAt'),
      },
      ...convertedFields,
      ...convertedAssetsFields,
    }
  })

  return isInputArray ? formattedPosts : formattedPosts[0]
}

/**
 * factory fn: recursive fetch all data from contentful
 * @param {string} queryName
 * @param {Function} queryStringFn
 * @param {boolean} [isOneRequest=false]
 * @param {number} [limit=1000]
 * @param {number} [skip = 0]
 * @param {Array<string>|Array<string>} [assetFields = []]
 * @param {Object} [cache = []]
 * @returns {Array}
 */
async function fetchAllEntriesViaRestAPI(
  queryName,
  queryStringFn,
  isOneRequest = false,
  limit = DEFAULT_FETCH_LIMIT,
  skip = 0,
  assetFields = DEFAULT_ASSET_FIELDS,
  cache = []
) {
  const response = await utils.sendRequest({ method: 'GET', url: queryStringFn(skip) })

  const items = get(response, 'data.items', [])
  const total = get(response, 'data.total', 0)

  const includedEntries = get(response, 'data.includes.Entry', [])
  const includedAssets = get(response, 'data.includes.Asset', [])

  const finallizedItems = convertContentfulEntryResponse(
    items,
    [...includedAssets, ...includedEntries],
    assetFields
  )
  const nextSkip = skip + limit

  if (isOneRequest) {
    return finallizedItems
  }

  // case: if has more, then recursive this function
  if (skip < total) {
    console.log(`fetching ${queryName} ${skip} - ${skip + limit}`)
    return fetchAllEntriesViaRestAPI(
      queryName,
      queryStringFn,
      isOneRequest,
      limit,
      nextSkip,
      assetFields,
      [...cache, ...finallizedItems]
    )
  }

  // case: receive all posts
  return cache
}

// Contentful REST API seems to be truncating seconds off of datetimes.
// This function adds seconds if it detects they are missing
const fixDate = date => (/\d\d:\d\d:\d\d/.test(date) ? date : `${date}:00.000Z`)

module.exports = {
  fetchAllEntriesViaRestAPI,
  convertContentfulEntryResponse,
  fixDate,
  DEFAULT_FETCH_LIMIT,
  CONTENTFUL_REST_URL,
  DEFAULT_ASSET_FIELDS,
}
