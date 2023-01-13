import get from 'lodash/get'
import has from 'lodash/has'
import { useEffect, useReducer, useCallback, useRef, useContext } from 'react'
import axios from 'axios'
import { LocaleStateContext } from '../components/context/LocaleProvider'
import {
  DEFAULT_POST_SCHEMA,
  CONTENTFUL_REST_URL,
  constructContentfulPostData,
  hasContentfulNextPage,
  totalContentfulResult,
} from 'wsc/utils/contentful'
import { isBottomPage, contentfulApiCurrentDateTime } from 'wsc/utils/common'

// TODO : We may merge useFetchPostsWithInifiteScroll() into this when this is stable.

/**
 * POSSIBLE SRC
 */
export const SRC = {
  CONTENTFUL_POST: 'CONTENTFUL_POST',
  CONTENTFUL_PROMO: 'CONTENTFUL_PROMO',
  CONTENTFUL_AUTHOR: 'CONTENTFUL_AUTHOR',
}

/**
 * CONFIG GENERATOR BASED ON SRC
 */

const CONFIG_FACTORY = {
  [SRC.CONTENTFUL_POST]: {
    entryType: 'post',
    totalResult: totalContentfulResult,
    hasNextPage: hasContentfulNextPage,
    transform: constructContentfulPostData,
    url: (query, page, limit, currentDateTime, locale) =>
      `${CONTENTFUL_REST_URL}&select=${DEFAULT_POST_SCHEMA}&content_type=post&include=1` +
      `${query}&order=-fields.publishDate` +
      `&limit=${limit}&skip=${limit * (page - 1)}` +
      `&locale=${locale}` +
      `&fields.publishDate[lte]=${currentDateTime}`,
    filterFunc: ({ featuredImage }) => !!get(featuredImage, 'url', false),
  },
  [SRC.CONTENTFUL_PROMO]: {
    entryType: 'promo',
    totalResult: totalContentfulResult,
    hasNextPage: hasContentfulNextPage,
    transform: constructContentfulPostData,
    url: (query, page, limit, currentDateTime, locale) =>
      `${CONTENTFUL_REST_URL}&content_type=promo&include=1` +
      `${query}&order=-fields.publishDate` +
      `&limit=${limit}&skip=${limit * (page - 1)}` +
      `&locale=${locale}` +
      `&fields.publishDate[lte]=${currentDateTime}`,
    filterFunc: ({ image }) => !!get(image, 'url', false),
  },
  [SRC.CONTENTFUL_AUTHOR]: {
    entryType: 'author_post',
    totalResult: totalContentfulResult,
    hasNextPage: hasContentfulNextPage,
    transform: constructContentfulPostData,
    url: (query, page, limit, currentDateTime, locale) => {
      return (
        `${CONTENTFUL_REST_URL}&content_type=author` +
        `${query}&order=-sys.updatedAt` +
        `&locale=${locale}` +
        `&limit=${limit}&skip=${limit * (page - 1)}`
      )
    },
    filterFunc: null,
  },
}
/**
 * REDUCER
 */

const TYPE = {
  RESET_FETCH: 'RESET_FETCH',
  FETCH_FAIL: 'FETCH_FAIL',
  FETCH_START: 'FETCH_START',
  FETCH_NEXT_PAGE: 'FETCH_NEXT_PAGE',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
}

const initialState = {
  posts: [],
  postsPool: [],
  cache: {},
  totalPosts: 0,
  isLoading: false,
  isComplete: false,
  isError: false,
  nextPageObj: {},
  updatableCaches: null,
  hasNextDisplayPage: true,
}

/**
 * @typedef {Object<string, any>} Action
 * @property {string} type
 * @property {Object<string, any>} [payload] Contentful API's response
 * @property {Array} [payload.posts]
 * @property {number} [payload.totalPosts]
 * @property {boolean} [payload.hasNextPage]
 */
/**
 * Reducer to be used inside hook
 * @param {*} state previous state
 * @param {Action} action
 * @returns {Object<string, any>} updated state
 */
const reducer = (state, action) => {
  switch (action.type) {
    case TYPE.RESET_FETCH:
      return {
        ...initialState,
      }
    case TYPE.FETCH_FAIL:
      return {
        ...state,
        isError: true,
        isComplete: true,
      }
    case TYPE.FETCH_START:
      return {
        ...state,
        isLoading: true,
      }
    case TYPE.FETCH_SUCCESS: {
      return {
        ...state,
        posts: [...state.posts, ...action.payload.posts],
        postsPool: [...action.payload.postsPool],
        isLoading: false,
        isComplete: action.payload.isComplete,
        isError: false,
      }
    }
    case TYPE.FETCH_NEXT_PAGE: {
      return {
        ...state,
        postsPool: [...state.postsPool, ...action.payload.postsPool],
        cache: action.payload.cache,
        totalPosts: action.payload.totalPosts,
        isLoading: true,
        isError: false,
        nextPageObj: action.payload.nextPageObj,
        hasNextDisplayPage: action.payload.hasNextDisplayPage,
        updatableCaches: action.payload.updatableCaches,
      }
    }
    default:
      throw new Error('Unknown type of action in reducer')
  }
}

/**
 * HOOK
 * @param {Object<string, any>} options
 * @param {Array} [options.srcList = [SRC.CONTENTFUL_POST, SRC.CONTENTFUL_PROMO]]
 * @param {number} [options.limit = 10] the number of posts per page
 * @param {string} [options.query = ''] query to be concated to the url according to
 *      Contentful's REST API documentation, e.g. "&fields.tag=education"
 * @param {number} [options.distanceFromBottomToFetchNextPage = 0] distance from
 *      the bottom of the page (in px) to trigger infinite scrolling
 * @returns {{ posts: Array, isLoading: boolean, isError: boolean, totalPosts: number}}
 *      note that isLoading will be true not only while fetching the first page
 *      but also while fetching the next page through infinite scrolling
 */
export const useFetchEntriesFromMultipleModelsWithInfiniteScroll = ({
  srcList = [SRC.CONTENTFUL_POST],
  limit = 10,
  query = '',
  distanceFromBottomToFetchNextPage = 0,
  filterFunc = null,
}) => {
  const { locale } = useContext(LocaleStateContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  // This ref will be 'true' at the time scroll event triggers fetching.
  // We cannot use 'isLoading' in state because 'setState' is async and it cannot
  // complete updating 'isLoading' state to 'true' before the next scroll event is fire.
  const isFetching = useRef(false)

  const fetchPost = useCallback(async () => {
    if (isFetching.current) return null

    dispatch({ type: TYPE.FETCH_START })

    const nextPageObj = { ...state.nextPageObj }
    const hasNextPageObj = {}
    let entryList = []
    let cacheObj = { ...state.cache }
    let totalEntries = 0
    let tempCache
    let updatableCaches =
      state.updatableCaches === null ? srcList.slice() : state.updatableCaches.slice()
    // The counter can check which content can be fetched.
    let hasNextDisplayPageCounter = 0
    let pendingRequestKeys = []
    let requestList = []
    try {
      // Prevent multiple fetching from adjacent scroll events by saving state to ref
      isFetching.current = true
      // We used for instead of Array.forEach because it supports async/await operation.
      for (let index = 0; index < srcList.length; index++) {
        // Load configs
        const key = srcList[index]
        tempCache = get(cacheObj, key, [])
        const config = CONFIG_FACTORY[key]

        if (!has(nextPageObj, key)) {
          nextPageObj[key] = 1
        }
        // Tricky Hack: (for series => multipleSeries in post content-model [REF: SC-10829])
        // Now, we don't have field `multipleSeries` in promo content-model.
        // So, we edit `query` to using fields `series` for promo content-model instead.
        // In the near future, field `multipleSeries` of post content-model
        // will change back to `series`. We can safely remove this tricky logic.
        let hQuery =
          key === SRC.CONTENTFUL_PROMO
            ? query.replace('fields.multipleSeries', 'fields.series')
            : query
        // Prepare URL to fetch next page posts.
        const PAGE_QUERY = config.url(
          hQuery,
          nextPageObj[key],
          limit,
          contentfulApiCurrentDateTime(),
          locale
        )
        // If cache rows is lower than settings then getting from Contentful REST API.
        if (tempCache.length < limit && updatableCaches.find(src => src === key)) {
          // We make an asynchronous call to improve page speed.
          pendingRequestKeys.push(key)
          requestList.push(axios.get(PAGE_QUERY))
        }
        // Merge to one array list.
        entryList = entryList.concat(tempCache)
      }

      // Wait all pending requests
      const completedRequests = await axios.all(requestList)
      // Combine data for sorting.
      for (let index = 0; index < completedRequests.length; index++) {
        const key = pendingRequestKeys[index]
        const config = CONFIG_FACTORY[key]
        const response = completedRequests[index]
        const postResponse = get(response, 'data', {})
        let convertedResult = config.transform(postResponse)
        const configFilterFunc = config.filterFunc

        if (filterFunc) {
          convertedResult = convertedResult.filter(filterFunc)
        }

        // Check filter function in config
        if (configFilterFunc) {
          convertedResult = convertedResult.filter(configFilterFunc)
        }

        hasNextPageObj[key] = config.hasNextPage(postResponse)
        totalEntries += config.totalResult(postResponse)

        // Skip current loop if query result size is zero.
        if (convertedResult.length === 0) continue

        // Put data to the rendering list.
        entryList = entryList.concat(convertedResult)
      }

      // Cleanup updatable flag.
      updatableCaches = []
      // Order it by publishDate field descendants.
      entryList.sort((src, dest) => new Date(dest.publishDate) - new Date(src.publishDate))
      // Move unused entries to pool.
      const pool = entryList.length > limit ? entryList.slice(limit - entryList.length) : []
      // Push entries from pool to cache.
      cacheObj = srcList.reduce((result, key) => {
        tempCache = get(result, key, [])
        // Push entries back to the cache if they are unused.
        tempCache = pool.filter(entry => entry.sys.contentTypeId === CONFIG_FACTORY[key].entryType)
        result[key] = tempCache || []
        // Update page counter for next calling.
        if (tempCache.length < limit && hasNextPageObj[key]) nextPageObj[key]++
        // Check number of available cache.
        if (tempCache.length > 0 || hasNextPageObj[key]) hasNextDisplayPageCounter += 1
        // Check that we can fetch the post from Contentful for all content types.
        if (hasNextPageObj[key]) updatableCaches.push(key)
        return result
      }, {})
      // Remove unused entries from display list.
      if (entryList.length > limit) entryList = entryList.slice(0, limit)

      // Update scrollable flag.
      const hasNextDisplayPage = hasNextDisplayPageCounter > 0
      dispatch({
        type: TYPE.FETCH_NEXT_PAGE,
        payload: {
          postsPool: entryList,
          cache: cacheObj,
          totalPosts: totalEntries,
          nextPageObj,
          hasNextDisplayPage,
          updatableCaches,
        },
      })

      // New scroll event can now trigger fetching.
      isFetching.current = false
    } catch (error) {
      // New scroll event can now trigger fetching.
      isFetching.current = false
      dispatch({ type: TYPE.FETCH_FAIL })

      console.log(
        `Error when trying to fetch more posts of query: ${query}` +
          `, limit: ${limit} and skip: ${limit}`,
        error
      )
    }
  }, [
    filterFunc,
    limit,
    locale,
    query,
    srcList,
    state.cache,
    state.nextPageObj,
    state.updatableCaches,
  ])

  useEffect(() => {
    // Reset state when the page was changed.
    dispatch({ type: TYPE.RESET_FETCH })
  }, [query, locale])

  useEffect(() => {
    // Fetch first page's posts whenever state was reset.
    if (state.nextPageObj === initialState.nextPageObj) {
      fetchPost()
    }
  }, [fetchPost, state.nextPageObj])

  useEffect(() => {
    // Add scroll event handler to trigger next page fetching.
    const handleInfiniteScroll = () => {
      if (
        !isFetching.current &&
        state.hasNextDisplayPage &&
        isBottomPage(distanceFromBottomToFetchNextPage)
      ) {
        fetchPost()
      }
    }

    window.addEventListener('scroll', handleInfiniteScroll)
    return () => window.removeEventListener('scroll', handleInfiniteScroll)
  }, [distanceFromBottomToFetchNextPage, state.nextPageObj, fetchPost, state.hasNextDisplayPage])

  useEffect(() => {
    // Check post in the pool
    if (state.postsPool.length >= limit) {
      dispatch({
        type: TYPE.FETCH_SUCCESS,
        payload: {
          posts: state.postsPool.slice(0, limit),
          postsPool: state.postsPool.slice(limit),
          isComplete: false,
        },
      })
    } else if (!state.hasNextDisplayPage && !state.isComplete) {
      dispatch({
        type: TYPE.FETCH_SUCCESS,
        payload: {
          posts: state.postsPool,
          postsPool: [],
          isComplete: true,
        },
      })
    } else if (
      !isFetching.current &&
      state.hasNextDisplayPage &&
      state.postsPool.length < limit &&
      isBottomPage(distanceFromBottomToFetchNextPage)
    ) {
      fetchPost()
    }
  }, [
    distanceFromBottomToFetchNextPage,
    fetchPost,
    limit,
    state.hasNextDisplayPage,
    state.isComplete,
    state.postsPool,
  ])

  return {
    totalPosts: state.totalPosts,
    posts: state.posts,
    isLoading: state.isLoading,
    isComplete: state.isComplete,
    isError: state.isError,
  }
}
