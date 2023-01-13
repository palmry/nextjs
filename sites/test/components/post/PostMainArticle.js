import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { useContext, useEffect, useRef, lazy } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { getConfig } from 'wsc/globalConfig'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import PortionLayout from '../PortionLayout'
import PostHeader from './PostHeader'
import ShareThisPost from './ShareThisPost'
import FancyList from './FancyList'
import RecommendedPosts from './RecommendedPosts'
import RelatedTags from './RelatedTags'
import PostGallery from './PostGallery'
import SponsoredElement from '../SponsoredElement'
import SeriesBackLink from './SeriesBackLink'
import SpokenLayer from './SpokenLayer'
import PostDisclaimer from './PostDisclaimer'
import { MEDIA, withImageBoxShadow, withFullscreenOnMobile } from '../../utils/styles'
import { AdSlot } from 'wildsky-components'
import { ScAdSlotRightRail } from '../AdProviderWrapper'
import MarkdownInjector from 'wsc/components/post/MarkdownInjector'
import { getPostUrl, changeBrowserUrl, getLastSeenUrlBeforeChange } from '../../utils/url'
import { getPostTargeting } from 'wsc/utils/postTargeting'
import RevContentUnit from 'wsc/components/post/RevContentUnit'
import { getActivePost, setActivePost } from 'wildsky-components'
import { setPostDimensions } from 'wsc/utils/googleTagManager'
import { setActiveCategory, setActiveSubCategory } from 'wsc/utils/activeCategory'
import getLastScrollDirection from 'wsc/utils/scrollDirection'
import {
  getPostRelatedCategories,
  getPostSponsor,
  isShowDisplayAdsForRhombus,
} from 'wsc/utils/common'
import { PostNavCarousel } from 'wsc/components/post/PostNavCarousel'
import PostSlider from '../PostSlider'
import ReactComponentLoader from 'wsc/components/ReactComponentLoader'
import { fbSendEvent } from 'wsc/utils/facebookPixel'
import { sendViewContentEvent as taboolaPageview } from 'wsc/utils/taboolaLib'
import { sendPageView as keyweePageview } from 'wsc/utils/keyweeLib'
import { sendPageview as lotamePageview } from 'wsc/utils/lotameLib'
import { addComscore } from 'wsc/utils/comscore'

const JWPlayer = lazy(() => import('../JWPlayer'))
const APP_CONFIGS = getConfig('AppConfig')

const ScArticle = styled.article`
  padding: 0;
  margin-bottom: 40px;

  ${MEDIA.TABLET`
    margin-bottom: 23px;
  `}
  ${MEDIA.DESKTOP`
    margin-bottom: 70px;
  `}
`
const ScHeaderLayout = styled.header`
  margin-bottom: 40px;
  ${MEDIA.TABLET`margin-bottom: 60px;`}
  ${MEDIA.DESKTOP`margin-bottom: 70px;`}
`

const ScSummaryLayout = styled.div`
  margin-bottom: 40px;
  > *:last-child {
    /* remove margin bottom of last element inside this component */
    margin-bottom: 0;
  }
  ${MEDIA.DESKTOP`margin-bottom: 50px;`}
`
const ScContentSection = styled.section`
  margin-bottom: 40px;
`
const ScShareButtonLayout = styled.div`
  margin-bottom: 40px;
`
const ScRelatedTagLayout = styled.div`
  /* There already is margin-bottom of each tag inside <RelatedTags/> component */
  margin-bottom: 30px;
`
const ScPostAside = styled.aside`
  padding-left: 108px;
  align-self: flex-start;
  height: 100%;
`
const SponsoredElementWithMargin = styled(SponsoredElement)`
  margin: -5px auto 30px;
  ${MEDIA.TABLET`margin: -12px auto 40px;`}
  ${MEDIA.DESKTOP`margin: 70px auto 50px;`}
`
const ScSticky = styled.div`
  position: sticky;
  top: 75px;
`
const ScJWPlayerLayout = styled.div`
  ${withFullscreenOnMobile}
  margin-bottom: 50px;
  ${MEDIA.TABLET`margin-bottom: 60px;`}
  ${MEDIA.DESKTOP`margin-bottom: 60px;`}
`
const ScJWPlayer = styled(JWPlayer)`
  ${withImageBoxShadow}
  position: relative;
  padding-bottom: 56.25%;
  & .jwplayer {
    position: absolute;
  }
`
const PostMainArticle = ({
  post,
  galleryData,
  componentInjectors,
  isInfiniteScrollPost,
  isLastPost,
  incontentAdCount,
  showDisplayAds,
  showVideoAds,
  postCount,
}) => {
  const articleRef = useRef()
  const firstView = useRef(true)
  const slotTargeting = getPostTargeting(post) || {}
  const { isDesktop } = useContext(DetectDeviceContext)
  const isGallery = galleryData.isGallery

  // get nested data from query
  const authors = get(post, 'authorsCollection.items')
  // handle gallery type
  // sponsor element
  const sponsor = getPostSponsor(post)

  const injectorOptions = isInfiniteScrollPost
    ? {
        teardown: false,
        appendId: `_${get(post, 'sys.id')}`,
        targeting: slotTargeting,
      }
    : {}
  if (!isInfiniteScrollPost && !getActivePost()) setActivePost(post)

  const enableDisclaimer = post.disclaimer && post.disclaimer !== 'None'

  const mainContent = (
    <div>
      <ScContentSection>
        {/* article's content -- summary */}
        {post.summaryTitle && (
          <ScSummaryLayout>
            <FancyList
              sumTitle={post.summaryTitle}
              topics={post.summaryBulletedList}
              textWeight={600}
            />
          </ScSummaryLayout>
        )}
        {/* article's content -- subheadings, i.e. <h2>, <h3> */}
        {post.content && (
          <MarkdownInjector
            markdown={post.content}
            componentInjectors={componentInjectors}
            injectorOptions={injectorOptions}
          />
        )}
        {/* We use SpokenLayer after content field rendered */}
        <SpokenLayer slug={post.slug} />
        {/* Disclaimer: when select any choice except "None", a legal disclaimer will be added to the bottom of the post. */}
        {enableDisclaimer && <PostDisclaimer type={post.disclaimer} />}
        {/* article's content when post type is gallery -- gallery section */}
        {isGallery && (
          <PostGallery
            post={post}
            postTitle={post.title}
            galleryData={galleryData}
            showDisplayAds={showDisplayAds}
            hideGallerySlideCountNumbers={post.hideGallerySlideCountNumbers}
            incontentAdCount={incontentAdCount}
            targeting={slotTargeting}
          />
        )}
        {post.videoId && (
          <ScJWPlayerLayout>
            <ReactComponentLoader>
              <ScJWPlayer
                isStaticShadowLength={true}
                className="JwPlayer"
                customPlayerId={`jw-player-${post.slug}-${post.videoId}`}
                videoId={post.videoId}
                customTargeting={slotTargeting}
                isSponsored={!!sponsor}
                showVideoAds={showVideoAds}
              />
            </ReactComponentLoader>
          </ScJWPlayerLayout>
        )}
        <RevContentUnit postCount={postCount} isSponsored={!!sponsor} />
      </ScContentSection>

      {/* article's footer */}
      <footer>
        {/* Share button */}
        <ScShareButtonLayout>
          <ShareThisPost
            url={window.location.origin + '/' + get(post, 'mainCategory.slug') + '/' + post.slug}
          />
        </ScShareButtonLayout>
        {/* Related tags */}
        {!isEmpty(post.tags) && (
          <ScRelatedTagLayout>
            <RelatedTags tags={post.tags} />
          </ScRelatedTagLayout>
        )}
        {/* Series links: Generate the back link of series page for all articles that contains a series object */}
        {get(post, 'multipleSeriesCollection.items[0]') &&
          get(post, 'multipleSeriesCollection.items[0].contentNavigation.itemsCollection.items', [])
            .length < 2 && (
            <SeriesBackLink
              sysId={post.multipleSeriesCollection.items[0].sys.id}
              seriesSlugTitle={post.multipleSeriesCollection.items[0].title}
              seriesSlugURL={post.multipleSeriesCollection.items[0].slug}
              currentPost={post.sys.id}
            />
          )}
        <PostNavCarousel CarouselComponent={PostSlider} currentPost={post} />
      </footer>
    </div>
  )

  /* post aside (Desktop only) */
  const postAside = isDesktop && (
    <ScPostAside>
      {showDisplayAds && (
        <ScAdSlotRightRail disabled={!showDisplayAds}>
          <AdSlot
            au3="rightRail_slot_1"
            teardown={isInfiniteScrollPost ? false : true}
            appendId={isInfiniteScrollPost ? `_${get(post, 'sys.id')}` : ''}
            targeting={slotTargeting}
          />
        </ScAdSlotRightRail>
      )}
      <RecommendedPosts limit={1} excludedPostSlugs={post.slug} />
      {showDisplayAds && (
        <ScSticky>
          <ScAdSlotRightRail disabled={!showDisplayAds}>
            <AdSlot
              au3="rightRail_slot_2"
              teardown={isInfiniteScrollPost ? false : true}
              appendId={isInfiniteScrollPost ? `_${get(post, 'sys.id')}` : ''}
              targeting={slotTargeting}
            />
          </ScAdSlotRightRail>
        </ScSticky>
      )}
    </ScPostAside>
  )

  useEffect(() => {
    // observe the viewport intersecting the article
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // This post entered view
            setActivePost(post)
            const relatedCategories = getPostRelatedCategories(post)
            setActiveCategory(get(post, 'mainCategory.title', ''))
            setActiveSubCategory(relatedCategories.toString())
            // Skip sending pageview when...
            //    1. scroll up from xxx to the last post
            //    2. scroll down from xxx to the main/first post
            if (
              (isLastPost && getLastScrollDirection() === 'up') ||
              (!isInfiniteScrollPost && getLastScrollDirection() === 'down')
            ) {
              // do nothing (seperate this to new "if" for easy reading)
            } else if ((!isInfiniteScrollPost && !firstView.current) || isInfiniteScrollPost) {
              setPostDimensions(post)
              // Temporarily append URL params to band-aid GA reporting issue
              changeBrowserUrl(
                `${getPostUrl(post)}${document.location.search}`,
                `${post.seoTitle || post.title} | ${APP_CONFIGS.name}`
              )
              // Send page view events when url is changed
              const url = `${getPostUrl(post)}${document.location.search}`
              const lastSeenUrl = getLastSeenUrlBeforeChange()
              if (url !== lastSeenUrl) {
                window.dataLayer.push({
                  pageviewURL: url, // For GA
                  parselyUrl: url,
                  parselyUrlRef: lastSeenUrl,
                  event: 'DynamicPageView',
                })
                fbSendEvent('PageView')
                taboolaPageview()
                keyweePageview()
                lotamePageview()
                // Implement pageview_candidate Keyword
                addComscore({
                  catString: `${getPostUrl(post).split('/')[3]}`,
                })
              }
            }
            firstView.current = false
          }
        })
      },
      { rootMargin: '-38% 0% -60% 0%' } // 38% to 40% of viewport height
    )
    observer.observe(articleRef.current)

    return () => {
      observer.disconnect()
      setPostDimensions() //resetting post data in dataLayer
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfiniteScrollPost])

  // check that we should add class noskimlinks to this post or not
  let noskimlinks = false
  const mainCategorySlug = get(post, 'mainCategory.slug')
  const relatedCategoriesSlug = get(post, 'relatedCategoriesCollection.items', []).map(
    cat => cat.slug
  )
  const allCategoriesSlugThisPost = [mainCategorySlug, ...relatedCategoriesSlug]

  for (let excludeCategorySlug of APP_CONFIGS.noSkimlinksForTheseCategorySlugs || []) {
    if (allCategoriesSlugThisPost.includes(excludeCategorySlug)) {
      noskimlinks = true
      break
    }
  }

  return (
    <ScArticle ref={articleRef} className={noskimlinks && 'noskimlinks'}>
      {/* article's header */}
      <ScHeaderLayout className="PostHeader">
        <PostHeader
          authors={authors}
          category={post.mainCategory}
          image={post.featuredImage}
          title={post.title}
          publishDate={post.publishDate}
          updatedDate={post.updatedDate}
          hidePublishDate={post.hidePublishDate}
          isInfiniteScrollPost={isInfiniteScrollPost}
          postSlug={post.slug}
          postId={post.sys.id}
          series={get(post, 'multipleSeriesCollection.items[0]', null)}
        />
      </ScHeaderLayout>
      {/* sponsor */}
      <SponsoredElementWithMargin sponsor={sponsor} />
      {isShowDisplayAdsForRhombus(post) && (
        <AdSlot
          au3="rhombus"
          outOfPage={true}
          appendId={isInfiniteScrollPost ? `_${get(post, 'sys.id')}` : ''}
          targeting={slotTargeting}
          showCallout={false}
        />
      )}
      {/* content */}
      <PortionLayout mainSection={mainContent} subSection={postAside} columnGap={'0'} />
      {/* author */}
      {/* this section does not need margin-bottom since we already set margin-bottom in <ScArticle> */}
      {/* https://jira.cafemom.com/browse/MOMCOM-568 */}
      {/* <PostAuthor authors={authors} /> */}
    </ScArticle>
  )
}

PostMainArticle.propTypes = {
  post: PropTypes.shape({
    tags: PropTypes.array,
    content: PropTypes.string,
    postType: PropTypes.string,
  }).isRequired,
  galleryData: PropTypes.shape({
    isGallery: PropTypes.bool,
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        slug: PropTypes.string,
        image: PropTypes.object,
        embedImage: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string,
        altTag: PropTypes.string,
        price: PropTypes.number,
        storeName: PropTypes.string,
        productLink: PropTypes.string,
        __typename: PropTypes.string,
      })
    ),
  }).isRequired,
  componentInjectors: PropTypes.array,
  slideSlug: PropTypes.string,
  showDisplayAds: PropTypes.bool,
  showVideoAds: PropTypes.bool,
  isInfiniteScrollPost: PropTypes.bool,
  isLastPost: PropTypes.bool.isRequired,
  incontentAdCount: PropTypes.number,
  postCount: PropTypes.number,
}

PostMainArticle.defaultProps = {
  componentInjectors: [],
  slideSlug: null,
  showDisplayAds: true,
  showVideoAds: true,
  isInfiniteScrollPost: false,
  incontentAdCount: 0,
  postCount: 0,
}

export default PostMainArticle
