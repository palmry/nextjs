import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import get from 'lodash/get'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import { useTranslator } from '../../hooks/useTranslator'
import { convertContentfulEntryResponse, CONTENTFUL_REST_URL } from 'wsc/utils/contentful'

const BASE_URL = `${CONTENTFUL_REST_URL}&include=1`

/**
 * QUERYSTRING GENERATOR
 */

/**
 * generate query string to query main-category
 * @param {Array<string>|string} categorySlug
 * @returns {string}
 */
export const getMainCategoryQueryString = categorySlug => {
  const queryCategorySlug = isString(categorySlug) ? [categorySlug] : categorySlug

  if (categorySlug && !isEmpty(queryCategorySlug))
    return (
      `&fields.mainCategory.fields.slug[in]=${queryCategorySlug.join(',')}` +
      `&fields.mainCategory.sys.contentType.sys.id=category`
    )
}

/**
 * MAIN COMPONENT
 */
const GetPostListQuery = props => {
  // get fetch options
  const { limit, queryString, orderBy, excludedPostSlugs, ignoreFetching, initialPosts } = props

  // set default state
  const [state, setState] = useState({
    posts: [],
    isError: false,
    isLoading: false,
  })

  const { locale } = useTranslator()

  useEffect(() => {
    async function fetchPosts() {
      try {
        let numberOfExcludedSlugs = isArray(excludedPostSlugs) ? excludedPostSlugs.length : 1
        let dateTime = new Date()
        dateTime.setHours(dateTime.getHours(), 0, 0, 0)
        let fetchUrl =
          BASE_URL +
          `&limit=${limit * 2 + numberOfExcludedSlugs}` +
          `&locale=${locale}` +
          `&content_type=post` +
          `&order=${orderBy}` +
          `&fields.publishDate[lte]=${dateTime.toISOString()}` +
          queryString

        const response = await axios.get(fetchUrl)
        const posts = get(response, 'data.items')
        const includedEntries = get(response, 'data.includes.Entry', [])
        const includedAssets = get(response, 'data.includes.Asset', [])

        const formattedResponse = convertContentfulEntryResponse(posts, [
          ...includedAssets,
          ...includedEntries,
        ])

        // filter specific excluded post slug
        const excludedSlugs = isArray(excludedPostSlugs) ? excludedPostSlugs : [excludedPostSlugs]
        // handle posts limit after filtered
        const filteredPost = formattedResponse
          .filter(({ slug }) => !excludedSlugs.includes(slug))
          .filter(({ featuredImage }) => !!get(featuredImage, 'url', false))
          .slice(0, limit)
        // validate after filtered
        if (isEmpty(filteredPost)) return null
        setState({ isLoading: false, isError: false, posts: filteredPost })
      } catch (error) {
        // case: request error (not 200)
        setState({ isLoading: false, isError: true, posts: [] })
      }
    }

    if (!ignoreFetching) {
      // set loading to true while request posts
      setState({ isLoading: true, isError: false, posts: [] })
      fetchPosts()
    }
  }, [limit, queryString, orderBy, excludedPostSlugs, ignoreFetching, initialPosts, locale])

  const params = ignoreFetching
    ? { isLoading: false, isError: false, posts: initialPosts.slice(0, limit) }
    : state
  return props.children(params)
}

GetPostListQuery.propTypes = {
  children: PropTypes.func.isRequired,
  limit: PropTypes.number,
  queryString: PropTypes.string,
  excludedPostSlugs: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  ignoreFetching: PropTypes.bool,
  initialPosts: PropTypes.arrayOf(PropTypes.object),
}

GetPostListQuery.defaultProps = {
  limit: 10,
  queryString: '',
  orderBy: '-fields.publishDate',
  excludedPostSlugs: [],
  ignoreFetching: false,
  initialPosts: [],
}

export default GetPostListQuery
