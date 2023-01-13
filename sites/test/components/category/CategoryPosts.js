import get from 'lodash/get'
import isNull from 'lodash/isNull'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
import {
  CONTENTFUL_REST_URL,
  constructContentfulCategoryFeaturePostData,
  getPostListString,
} from 'wsc/utils/contentful'
import PostList from '../PostList'
import { Redirect } from 'react-router-dom'
import routes from '../../configs/routes'

// [MOMCOM-364] setting feature posts on each category page
// We use `include=2` below because we need these values
//    categoryPage.featurePost.displayCategory.title
//    categoryPage.featurePost.displayCategory.slug
//    categoryPage.featurePost.mainCategory.slug
const url = query => `${CONTENTFUL_REST_URL}&content_type=categoryPage&include=2${query}&limit=1`

const CategoryPosts = props => {
  const [postsQuery, setPostsQuery] = useState(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const { src, query, category } = props

  // search category in categoryPage model
  const featuredPostQueryString = `&fields.category.sys.id=${category.sys.id}`

  // check whether given category config is sub-category or not
  const queryKey = category.isPrimaryCategory ? 'mainCategory' : 'relatedCategories'
  // according to contentful limitation,
  // we can search on multiple reference field with sys.id only
  const queryString = `&fields.${queryKey}.sys.id=${category.sys.id}&sys.id[nin]=${postsQuery}`

  const categoryFilterFunc = post => {
    // [SC-22399] replace reading field 'sponsor.name' from
    //    'post.multipleSeries.sponsor.name' and
    //    'post.relatedCategories.sponsor.name'
    // that use 'include=2' with 'sponsor.sys.id' for saving cost/time
    if (category.sponsor) {
      const categorySponsorSysId = get(category, 'sponsor.sys.id', '')

      // Check post sponsor
      if (post.sponsor && get(post, 'sponsor.sys.id') !== categorySponsorSysId) {
        return false
      }

      // Check post series sponsor (only first/main series)
      const postSeriesSponsor = get(post, 'multipleSeries[0].sponsor', null)
      if (postSeriesSponsor && get(postSeriesSponsor, 'sys.id') !== categorySponsorSysId) {
        return false
      }

      // check sponsor from list of related categories
      const relatedCategories = get(post, 'relatedCategories', [])
      for (const relatedCategory of relatedCategories) {
        if (relatedCategory.sponsor) {
          if (get(relatedCategory, 'sponsor.sys.id') !== categorySponsorSysId) {
            return false
          }
          break
        }
      }
    }

    // If all cases is passed, we return true then useFetchPostsWithInfiniteScroll will not kick the post from query result
    return true
  }

  useEffect(() => {
    const fetchPost = async () => {
      // Prepare URL to fetch next page posts
      const PAGE_QUERY = url(featuredPostQueryString)

      try {
        setIsLoading(true)
        const response = await axios.get(PAGE_QUERY)
        const postsResponse = get(response, 'data', {})
        setPosts([])
        setPostsQuery('')
        if (postsResponse.total > 0) {
          const postsList = get(postsResponse, 'items[0].fields.featurePost', [])

          setPosts(constructContentfulCategoryFeaturePostData(postsResponse))
          if (postsList) {
            setPostsQuery(getPostListString(postsList))
          }
        }
        setIsLoading(false)
      } catch (error) {
        console.log(`Error when trying to fetch posts of query: ${query}`, error)
        setIsError(true)
      }
    }
    fetchPost()
  }, [featuredPostQueryString, query, src])

  if (isError) return <Redirect to={routes.error.path} />
  if (isLoading || isNull(postsQuery)) return null
  return (
    <>
      <PostList queryString={queryString} initialPost={posts} filterFunc={categoryFilterFunc} />
    </>
  )
}

CategoryPosts.propTypes = {
  src: PropTypes.string,
  query: PropTypes.string,
  category: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.object,
    credit: PropTypes.string,
  }).isRequired,
}

CategoryPosts.defaultProps = {
  src: 'CONTENTFUL',
  query: '',
}

export default CategoryPosts
