import React, { useState, lazy } from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import InfinitePosts, { FEATURED_POST_SRC } from './InfinitePosts'
import { InfiniteScrollQuery } from '../graphql/InfiniteScrollQuery'
import { contentfulApiCurrentDateTime, getPostSponsor } from 'wsc/utils/common'
import { getCurrentIndex } from 'wsc/components/context/PostNavProvider'
import ReactComponentLoader from 'wsc/components/ReactComponentLoader'

const PostTrending = lazy(() => import('./PostTrending'))

const PostRelatedArticle = ({ post, categorySlug }) => {
  const [infinitePostsList, setInfinitePostsList] = useState([post.slug])
  const infinitePostsCallback = InfinitePosts => {
    setInfinitePostsList(InfinitePosts)
  }

  const sponsor = getPostSponsor(post)
  const isSponsored = !!sponsor

  const postTrending = (
    <ReactComponentLoader>
      <PostTrending relateCategory={categorySlug} limit={4} excludedPostSlugs={infinitePostsList} />
    </ReactComponentLoader>
  )

  // If the post is in the series which contains a content navigation entry, we will fetch post from item list of content navigation entry.
  // Otherwise, we will use InfiniteScrollQuery component.
  let infiniteScrollPosts = null
  let infinitePostProps = {
    key: `${post.slug}-is-posts`,
    post,
    infinitePostsCallback,
  }
  const itemList = get(
    post,
    'multipleSeriesCollection.items[0].contentNavigation.itemsCollection.items',
    null
  )
  if (itemList != null) {
    const currentFeaturedPosts = [...itemList]
      .splice(getCurrentIndex(post, itemList) + 1)
      .map(item => item.post)
    infinitePostProps['featuredPosts'] = currentFeaturedPosts
    infinitePostProps['featuredPostSrc'] = FEATURED_POST_SRC.contentNavigation
    infiniteScrollPosts = (
      <React.Fragment>
        <InfinitePosts {...infinitePostProps} />
        {postTrending}
      </React.Fragment>
    )
  } else {
    infiniteScrollPosts = (
      // we use only 3 posts in Infinite scroll section but we will query 4 posts in case there is a post duplicate with main post
      // then filter out some post that its publish date might set to future date
      <InfiniteScrollQuery postLimit={4} title={'Infinite Scroll'}>
        {({ queryResponse }) => {
          const { state, infiniteScrollCollection } = queryResponse
          const featuredPosts = get(
            infiniteScrollCollection,
            'items[0].featuredPostsCollection.items',
            []
          )

          if (state.isLoading) return null

          let currentFeaturedPosts = []
          if (!state.isError && !isEmpty(featuredPosts)) {
            // filter out post that its publish date is set to future date and also remove the main post to prevent duplicate post
            currentFeaturedPosts = featuredPosts.filter((featuredPost, index) => {
              const postPublishDate = Date.parse(featuredPost.publishDate)
              return (
                postPublishDate <= Date.parse(contentfulApiCurrentDateTime()) && //check if it's not future post
                featuredPost.sys.id !== post.sys.id && // check if it's not the main post
                featuredPosts.indexOf(featuredPost) === index // check duplicate post
              )
            })
          }
          infinitePostProps['featuredPosts'] = currentFeaturedPosts
          return (
            <React.Fragment>
              {!isSponsored && <InfinitePosts {...infinitePostProps} />}
              {postTrending}
            </React.Fragment>
          )
        }}
      </InfiniteScrollQuery>
    )
  }

  return infiniteScrollPosts
}

PostRelatedArticle.propTypes = {
  post: PropTypes.shape({
    tags: PropTypes.array,
    content: PropTypes.string,
    postType: PropTypes.string,
  }).isRequired,
  categorySlug: PropTypes.string,
}

PostRelatedArticle.defaultProps = {
  categorySlug: null,
}

export default PostRelatedArticle
