import get from 'lodash/get'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import Layout from '../Layout'
import DocumentHead from '../DocumentHead'
import PostMainArticle from './PostMainArticle'
import PostRelatedArticle from './PostRelatedArticle'
import APP_CONFIGS from '../../configs/app'
import isPrerenderBot from 'wsc/utils/browser'

import { MEDIA } from '../../utils/styles'
import { detectPostType } from 'wsc/utils/detectPostType'
import { getPostTargeting } from 'wsc/utils/postTargeting'

import { AdSlot } from 'wildsky-components'
import {
  setActiveCategory,
  setActiveSubCategory,
  clearAllActiveCategory,
} from 'wsc/utils/activeCategory'
import AdProviderWrapper, { ScAdSlotLeader } from '../AdProviderWrapper'
import AdFooter from 'wsc/components/AdFooter'
import { processMarkdown } from 'wsc/components/post/MarkdownInjector'
import {
  getIncontentSlots,
  IncontentSlot1Injector,
  IncontentSlot2Injector,
  IncontentSlotXInjector,
  PmpSlot1Injector,
  ConnatixInjector,
} from '../../utils/componentInjectors/incontentAdInjectors'
import { getSuggestedPostInjector } from '../../utils/componentInjectors/suggestedPostInjector'
import { fbasid } from 'wsc/utils/utmValues'

import { getPostBaseUrl, getPostUrl } from '../../utils/url'
import { getDocumentHeadKey, getPostRelatedCategories, getPostSponsor } from 'wsc/utils/common'
import { useTranslator } from '../../hooks/useTranslator'
import { useExperiment } from 'wsc/components/AbTest'

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin: 50px 0;`}
  ${MEDIA.TABLET`margin: 40px 0;`}
  ${MEDIA.MOBILE`margin: 30px 0;`}
`

/*----------------------------------------------------------------------------------
 *  COMPONENTS
 *---------------------------------------------------------------------------------*/

const GenerateParselyData = (post, sponsor) => {
  const imageUrl = post.socialImage ? post.socialImage.url : post.featuredImage.url
  const subCategories = get(post, 'relatedCategoriesCollection.items', [])
  const series = get(post, 'multipleSeriesCollection.items', [])
  const internalTags = get(post, 'internalTags', [])

  let keywords = [`postId:${post.sys.id}`]
  if (post.tags) keywords.push(...post.tags)
  if (sponsor) keywords.push(`sponsorName:${sponsor?.name}`)
  if (!isEmpty(subCategories)) {
    subCategories.forEach(entry => {
      keywords.push(`subCategory:${entry.slug}`)
    })
  }
  if (!isEmpty(series)) {
    series.forEach(entry => {
      keywords.push(`series:${entry.slug}`)
    })
  }
  if (fbasid) keywords.push(`fbasid:${fbasid}`)
  if (post.intentionTag) keywords.push(`intentionTag:${post.intentionTag}`)
  if (!isEmpty(internalTags)) {
    internalTags.forEach(entry => {
      keywords.push(`internalTag:${entry}`)
    })
  }
  if (post.postType) keywords.push(`postType:${post.postType}`)

  return {
    '@context': 'http://schema.org',
    '@type': 'NewsArticle',
    headline: post.seoTitle || post.title,
    url: post.canonicalLink || getPostBaseUrl(),
    thumbnailUrl: imageUrl,
    image: [
      // This is for Google search results only. Three images in the aspect ratios: 1:1, 4:3, 16:9
      imageUrl + '?fm=jpg&fl=progressive&q=50&w=900&h=900&fit=fill', // 1:1
      imageUrl + '?fm=jpg&fl=progressive&q=50&w=1200&h=900&fit=fill', // 4:3
      imageUrl + '?fm=jpg&fl=progressive&q=50&w=1200&h=675&fit=fill', // 16:9
    ],
    datePublished: post.sys.firstPublishedAt,
    dateModified: post.publishDate,
    articleSection: post.mainCategory.slug,
    author: post.authorsCollection.items.map(author => {
      return {
        '@type': 'Person',
        name: author.name,
        url: APP_CONFIGS.envUrl + '/author/' + author.slug,
      }
    }),
    keywords: keywords,
    publisher: {
      '@type': 'Organization',
      name: APP_CONFIGS.name,
      logo: {
        '@type': 'ImageObject',
        url: APP_CONFIGS.envUrl + APP_CONFIGS.logo,
      },
    },
  }
}
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const PostPage = ({ post, slideSlug }) => {
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)
  const { locale } = useTranslator()
  const { isGallery } = detectPostType(post.postType)
  const externalPlayerExperiment = useExperiment('external-player')

  useEffect(() => {
    const relatedCategories = getPostRelatedCategories(post)
    setActiveCategory(get(post, 'mainCategory.title', ''))
    setActiveSubCategory(relatedCategories.toString())
    return () => {
      clearAllActiveCategory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

  const galleryData = {
    isGallery: isGallery,
    slides: get(post, 'gallerySlidesCollection.items', []),
  }

  if (isEmpty(post)) {
    return null
  }

  const sponsor = getPostSponsor(post)
  const showDisplayAds = get(sponsor, 'showDisplayAds') === false ? false : true
  const showVideoAds = get(sponsor, 'showVideoAds') === false ? false : true

  const slotTargeting = getPostTargeting(post)
  const slotConfig = { targeting: slotTargeting }
  const slotList = [
    ['leader', slotConfig],
    ['rhombus', slotConfig],
  ]
  if (isMobile) {
    slotList.push(['footer', slotConfig])
  } else if (isDesktop) {
    slotList.push(['rightRail_slot_1', slotConfig])
    slotList.push(['rightRail_slot_2', slotConfig])
  }

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

  let injectorOptions = {
    teardown: false,
    appendId: `_${get(post, 'sys.id')}`,
    targeting: slotTargeting,
  }

  // External Player Experiment => should NOT appear on any Sponsored content
  if (!sponsor && !isPrerenderBot() && externalPlayerExperiment.connatix) {
    componentInjectors.push(ConnatixInjector)
  }

  // preprocess markdown so we can define incontent ads
  processMarkdown(componentInjectors, post.content, injectorOptions)
  const incontentAdCount = Object.values(getIncontentSlots()).reduce((sum, cur) => sum + cur, 0)

  const categorySlug = get(post, 'mainCategory.slug')
  // validate and map relatedCategories slug for subcategories
  const hasRelatedCategories = has(post, 'relatedCategoriesCollection.items[0].slug')
  const relatedCategoriesSlug = hasRelatedCategories
    ? map(post.relatedCategoriesCollection.items, 'slug')
    : null

  // Checking "Is this the last post of the page?"
  // to prevent sending unwanted pageview when scrolling up from the bottom of the page
  // (Trending stories / Most Popular section)
  const contentNavigationItems = get(
    post,
    'multipleSeriesCollection.items[0].contentNavigation.itemsCollection.items',
    null
  )

  let lastPostIdOfContentNav = null
  if (contentNavigationItems && contentNavigationItems.length > 0) {
    lastPostIdOfContentNav = get(
      contentNavigationItems[contentNavigationItems.length - 1],
      'post.sys.id',
      null
    )
  }

  // Post will be the last post of the page if...
  //    1. has sponsor and no content nav (from series)
  // or 2. has content nav and this post is the last item of that nav
  const isLastPost =
    (sponsor !== null && contentNavigationItems === null) || lastPostIdOfContentNav === post.sys.id

  return (
    <Layout>
      {/* inject <head> tag */}
      <DocumentHead
        key={getDocumentHeadKey(locale, post.slug)}
        title={post.title}
        image={post.featuredImage}
        publishDate={post.publishDate}
        // open graph
        ogTitle={post.socialTitle}
        ogImage={post.socialImage}
        ogType="article"
        // search engine
        seoTitle={post.seoTitle}
        seoDescription={post.seoDescription}
        canonicalLink={post.canonicalLink || getPostBaseUrl()}
        mainCategorySlug={categorySlug}
        relatedCategorySlugs={relatedCategoriesSlug}
        parselyData={GenerateParselyData(post, sponsor)}
      />
      <AdProviderWrapper
        slotList={slotList}
        reset={post.slug}
        active={showDisplayAds}
        postId={get(post, 'sys.id')}
      >
        {showDisplayAds && (
          <ScAdSlotLeader disabled={!showDisplayAds} marginTop={isDesktop ? '50px' : '40px'}>
            <AdSlot au3="leader" />
          </ScAdSlotLeader>
        )}

        <ScWrapper>
          <PostMainArticle
            post={post}
            galleryData={galleryData}
            componentInjectors={componentInjectors}
            slideSlug={slideSlug}
            isLastPost={isLastPost}
            incontentAdCount={incontentAdCount}
            showDisplayAds={showDisplayAds}
            showVideoAds={showVideoAds}
          />
          <PostRelatedArticle post={post} categorySlug={categorySlug} />
        </ScWrapper>

        {showDisplayAds && <AdFooter refreshAd={showDisplayAds} />}
      </AdProviderWrapper>
    </Layout>
  )
}

PostPage.propTypes = {
  post: PropTypes.shape({
    tags: PropTypes.array,
    content: PropTypes.string,
    postType: PropTypes.string,
  }),
  slideSlug: PropTypes.string,
}

PostPage.defaultProps = {
  post: {},
  slideSlug: null,
}

export default PostPage
