import React, { useState, useRef, useContext, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import PropTypes from 'prop-types'
import { AdSlot } from 'wildsky-components'
import styled from 'styled-components'

import { ScAdSlotLeader } from '../AdProviderWrapper'
import PostMainArticle from './PostMainArticle'
import GetInfiniteScrollPostQuery from '../graphql/GetInfiniteScrollPostQuery'
import { GetPostQuery } from '../graphql/GetPostQuery'
import get from 'lodash/get'
import appConfig from '../../configs/app'
import {
  PmpSlot1Injector,
  IncontentSlot1Injector,
  IncontentSlot2Injector,
  IncontentSlotXInjector,
  getIncontentSlots,
  resetIncontentSlots,
} from '../../utils/componentInjectors/incontentAdInjectors'
import { getSuggestedPostInjector } from '../../utils/componentInjectors/suggestedPostInjector'
import { detectPostType } from 'wsc/utils/detectPostType'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { getPostTargeting } from 'wsc/utils/postTargeting'
import { processMarkdown } from 'wsc/components/post/MarkdownInjector'
import { MEDIA } from '../../utils/styles'
import { getPostSponsor } from 'wsc/utils/common'
import { getPostUrl } from '../../utils/url'

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin: 50px 0;`}
  ${MEDIA.TABLET`margin: 40px 0;`}
  ${MEDIA.MOBILE`margin: 30px 0;`}
`

export const FEATURED_POST_SRC = {
  infiniteScrollModel: 0,
  contentNavigation: 1,
}

const InfinitePosts = props => {
  const {
    post: { mainCategory, postType, slug },
    featuredPosts,
    featuredPostSrc,
    infinitePostsCallback,
  } = props

  const { isDesktop } = useContext(DetectDeviceContext)
  const postSlug = slug

  const [posts, setPosts] = useState([])
  const [postSlugs, setPostSlugs] = useState([postSlug])
  const [skip, setSkip] = useState(0)
  const [ref, inView] = useInView({ rootMargin: '0px 0px 2000px 0px' })
  const debounce = useRef(false)
  const queryKeys = useRef([])

  useEffect(() => {
    infinitePostsCallback(postSlugs)
  }, [postSlugs, infinitePostsCallback])

  const maxInfiniteScrollPosts =
    featuredPostSrc === FEATURED_POST_SRC.contentNavigation
      ? featuredPosts.length
      : appConfig.maxInfiniteScrollPosts

  const renderedPosts = (
    <>
      {posts}
      <div ref={ref}></div>
    </>
  )

  if (inView && !debounce.current && postSlugs.length < maxInfiniteScrollPosts + 1) {
    debounce.current = true
    let QueryComponent
    let queryProps

    // Check if there is any featured post to be displayed
    if (featuredPosts.length >= postSlugs.length) {
      const featuredPostIndex = postSlugs.length - 1
      QueryComponent = GetPostQuery
      queryProps = {
        slug: featuredPosts[featuredPostIndex].slug,
        limit: 1,
        key: `IS_${postSlugs.length}`,
      }
    } else if (featuredPostSrc === FEATURED_POST_SRC.infiniteScrollModel) {
      QueryComponent = GetInfiniteScrollPostQuery
      queryProps = {
        categorySlug: get(mainCategory, 'slug'),
        postType: postType,
        excludeSlugs: postSlugs,
        key: `IS_${postSlugs.length + skip}`,
        skip: skip,
      }
    }

    // This will fix the case that some post is duplicated due to the inView state may be updated twice.
    // We can easily reproduce this issue by reducing the internet speed to 3G Fast or less on Chrome.
    if (queryKeys.current.includes(queryProps?.key)) {
      setTimeout(() => (debounce.current = false), 1000)
      return renderedPosts
    } else {
      queryKeys.current.push(queryProps?.key)
    }

    const NextPost = (
      <QueryComponent {...queryProps}>
        {({ queryResponse }) => {
          // get post from query response
          const { state } = queryResponse
          const post = get(queryResponse, 'postCollection.items[0]')

          // handle internal state
          if (state.isLoading || state.isError) {
            if (state.isError) {
              // This allows sending the failed request.
              const queryIndex = queryKeys.current.indexOf(queryProps?.key)
              if (queryIndex > -1) queryKeys.current.splice(queryIndex, 1)
              setSkip(skip + 1)
              debounce.current = false
            }
            return null
          }

          if (!post) {
            return null
          }

          const sponsor = getPostSponsor(post)
          const showDisplayAds = get(sponsor, 'showDisplayAds') === false ? false : true
          const showVideoAds = get(sponsor, 'showVideoAds') === false ? false : true

          const { isGallery } = detectPostType(post.postType)
          // record slugs of posts already loaded
          setPostSlugs([...postSlugs, post.slug])

          let componentInjectors = []

          // set up suggested post injector
          if (!isGallery) {
            componentInjectors = [
              getSuggestedPostInjector(
                post.recommendedPostsCollection.items,
                get(post, 'mainCategory.slug'),
                post.slug,
                `${getPostUrl(post)}${document.location.search}`
              ),
            ]
          }

          const slotTargeting = getPostTargeting(post)
          // set up component injectors
          if (showDisplayAds) {
            componentInjectors = [
              ...componentInjectors,
              PmpSlot1Injector,
              IncontentSlot1Injector,
              IncontentSlot2Injector,
              IncontentSlotXInjector,
            ]
          }
          // reset incontent slots for this post
          resetIncontentSlots()
          processMarkdown(componentInjectors, post.content, {
            teardown: false,
            appendId: `_${get(post, 'sys.id')}`,
            targeting: slotTargeting,
          })
          const incontentAdCount = Object.values(getIncontentSlots()).reduce(
            (sum, cur) => sum + cur,
            0
          )

          const galleryData = {
            isGallery: isGallery,
            slides: get(post, 'gallerySlidesCollection.items', []),
          }

          return (
            <>
              {showDisplayAds && (
                <ScAdSlotLeader disabled={!showDisplayAds} marginTop={isDesktop ? '50px' : '40px'}>
                  <AdSlot
                    au3="leader"
                    targeting={slotTargeting}
                    teardown={false}
                    appendId={`_${get(post, 'sys.id')}`}
                  />
                </ScAdSlotLeader>
              )}
              <ScWrapper>
                <PostMainArticle
                  key={'post-main-article-' + post.slug}
                  state={state}
                  postCount={posts.length + 1}
                  post={post}
                  componentInjectors={componentInjectors}
                  galleryData={galleryData}
                  isInfiniteScrollPost={true}
                  isLastPost={postSlugs.length === maxInfiniteScrollPosts}
                  incontentAdCount={incontentAdCount}
                  showDisplayAds={showDisplayAds}
                  showVideoAds={showVideoAds}
                />
              </ScWrapper>
            </>
          )
        }}
      </QueryComponent>
    )

    setPosts([...posts, NextPost])
    setTimeout(() => (debounce.current = false), 1000)
  }
  return renderedPosts
}

InfinitePosts.propTypes = {
  post: PropTypes.shape({
    tags: PropTypes.array,
    content: PropTypes.string,
    postType: PropTypes.string,
  }).isRequired,
  featuredPosts: PropTypes.array,
  featuredPostSrc: PropTypes.number,
  infinitePostsCallback: PropTypes.func,
}

InfinitePosts.defaultProps = {
  featuredPosts: [],
  featuredPostSrc: FEATURED_POST_SRC.infiniteScrollModel,
  infinitePostsCallback: null,
}

export default InfinitePosts
