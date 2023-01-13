import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import find from 'lodash/find'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import { contentfulApiCurrentDateTime } from 'wsc/utils/common'

export const DEFAULT_POST_SCHEMA = [
  'sys',
  'fields.publishDate',
  'fields.updatedDate',
  'fields.hidePublishDate',
  'fields.title',
  'fields.slug',
  'fields.mainCategory',
  'fields.relatedCategories',
  'fields.displayCategory',
  'fields.featuredImage',
  'fields.squareCroppingPreference',
  'fields.multipleSeries',
  'fields.sponsor',
].join()

export const CONTENTFUL_API_ACCESSTOKEN =
  process.env.REACT_APP_ENVIRONMENT === 'preview'
    ? process.env.REACT_APP_CONTENTFUL_PREVIEW_API_ACCESSTOKEN
    : process.env.REACT_APP_CONTENTFUL_API_ACCESSTOKEN

export const CONTENTFUL_REST_URL = `${
  process.env.NODE_ENV === 'production' && process.env.REACT_APP_ENVIRONMENT !== 'preview'
    ? '/api'
    : `https://${process.env.REACT_APP_CONTENTFUL_API_HOST}`
}/spaces/${process.env.REACT_APP_CONTENTFUL_SPACEID}/environments/${
  process.env.REACT_APP_CONTENTFUL_ENVIRONMENT
}/entries?access_token=${process.env.REACT_APP_CONTENTFUL_API_ACCESSTOKEN}`

export const CONTENTFUL_GRAPHQL_URL = `${
  process.env.NODE_ENV === 'production' ? '/graphql' : 'https://graphql.contentful.com'
}/content/v1/spaces/${process.env.REACT_APP_CONTENTFUL_SPACEID}/environments/${
  process.env.REACT_APP_CONTENTFUL_ENVIRONMENT
}`

const DEFAULT_ASSET_FIELDS = ['featuredImage', 'socialImage', 'bannerImage', 'logo', 'image']
const CIRCULAR_RELATION_FIELDS = ['translatedPost', 'relatedContent', 'recommendedPosts']

/**
 * convert contentful post response to graphql response format
 * @param {Object<string,any>|Object<string,any>[]} ctfPostResponse
 * @param {Object<string,any>|Object<string,any>[]} [ctfIncludedItems = []]
 * @returns {Object<string,any>|Object<string,any>[]|null}
 */
export function convertContentfulEntryResponse(
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
        contentTypeId: get(sys, 'contentType.sys.id'),
        updatedAt: get(sys, 'updatedAt'),
      },
      ...convertedFields,
      ...convertedAssetsFields,
    }
  })

  return isInputArray ? formattedPosts : formattedPosts[0]
}
/**
 * Transform Contentful API's response
 * @param {{
 *  items: Array,
 *  includes: {
 *    Entry: Array,
 *    Asset: Array
 *  },
 * }} data Contentful's response
 * @returns {Object<string, any>}
 */
export function constructContentfulPostData(data) {
  const posts = get(data, 'items')
  const entries = get(data, 'includes.Entry', [])
  const assets = get(data, 'includes.Asset', [])
  const formattedResponse = convertContentfulEntryResponse(posts, [...assets, ...entries])
  return formattedResponse
}
/**
 * Transform Contentful API's response
 * @param {{
 *  items: Array,
 *  includes: {
 *    Entry: Array,
 *    Asset: Array
 *  },
 * }} data Contentful's response
 * @returns {Object<string, any>}
 */
export function constructContentfulCategoryFeaturePostData(data) {
  const posts = get(data, 'items[0].fields.featurePost')
  const uniquePosts = uniqBy(posts, 'sys.id')
  const entries = get(data, 'includes.Entry', [])
  const assets = get(data, 'includes.Asset', [])
  const formattedResponse = convertContentfulEntryResponse(uniquePosts, [...assets, ...entries])

  let filterdResponse = []

  formattedResponse.map(post => {
    const postPublishDate = Date.parse(post.publishDate + ':00Z')

    if (postPublishDate <= Date.parse(contentfulApiCurrentDateTime())) {
      const { sys, ...fields } = post
      filterdResponse.push({ sys: sys, fields: fields })
    }
    return null
  })

  const response = convertContentfulEntryResponse(filterdResponse, [...assets, ...entries])

  return response
}
/**
 * Determine if there are more posts to display on the next page
 * @param {Object<string, any>} response
 * @param {number} response.total total posts
 * @param {number} response.skip skipped posts
 * @param {number} response.limit the number of posts on the current page
 * @returns {boolean}
 */
export function hasContentfulNextPage(response) {
  const { total, skip, limit } = response
  return total > skip + limit
}
/**
 * get total posts count
 * @param {Object<string, any>} response
 * @returns {number}
 */
export function totalContentfulResult(response) {
  return response.total
}
/**
 * get posts list and return as string
 * @param [{
 *  items: Array,
 *  includes: {
 *    Entry: Array,
 *    Asset: Array
 *  },
 * }] data Contentful's response
 * @returns {string}
 */
export function getPostListString(data) {
  const uniqueData = uniqBy(data, 'sys.id')
  const result = uniqueData.reduce((result, post) => {
    return (result += post.sys.id + ',')
  }, '')
  return result
}
