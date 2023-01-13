import React, { useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import get from 'lodash/get'

import PostGalleryItem from './PostGalleryItem'
import SuggestedPosts from './SuggestedPosts'
import { MEDIA, COLORS } from '../../utils/styles'
import { ScAdSlotInContent } from '../AdProviderWrapper'
import { AdSlot } from 'wildsky-components'
import { utmCampaign } from 'wsc/utils/utmValues'
import VisibilitySensor from 'react-visibility-sensor'
import { getPostUrl, changeBrowserUrl } from '../../utils/url'
import { isActivePost } from 'wildsky-components'
import getLastScrollDirection from 'wsc/utils/scrollDirection'

const suggestedPostsPosition = 5

const ScSeparator = styled.hr`
  width: 100%;
  margin: 0 0 4px;

  ${MEDIA.TABLET`margin-bottom: 6px;`}
  ${MEDIA.DESKTOP`margin-bottom: 12px;`}
`
const ScItemNumber = styled.div.attrs({
  className: 'font-description',
})`
  color: ${COLORS.GREY};
  min-height: 20px;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/
const PostGallery = ({
  postTitle,
  galleryData,
  showDisplayAds,
  match,
  hideGallerySlideCountNumbers,
  post,
  incontentAdCount,
  targeting,
}) => {
  const slides = galleryData.slides
  const slideSlug = get(match, 'params.slideSlug')

  // Temporarily removing debounce from url change for 1:1 comp. with old ML
  // const changeBrowserUrlDebounced = debounce((url, title) => {
  //   // only change the URL if we are still the active post
  //   if (isActivePost(post)) changeBrowserUrl(url, title)
  // }, 300)
  const changeBrowserUrlCustom = (url, title) => {
    // only change the URL if we are still the active post
    if (isActivePost(post)) changeBrowserUrl(url, title)
  }

  //scroll to given slide
  let scrollToElement = React.useRef()
  useEffect(() => {
    if (scrollToElement.current && slideSlug) {
      scrollToElement.current.scrollIntoView()
    }
  }, [postTitle, scrollToElement, slideSlug])

  if (isEmpty(slides)) return null
  // start gallery inContent ad index after last incontent ad
  let adIndex = incontentAdCount

  // Set percent of viewport to define when slide is visible
  const visibileTopPercentage = 0.2
  const visibileBottomPercentage = 0.5

  // set up base URL for when we change URL
  let baseUrl = getPostUrl(post)

  //change URL appropriate as user scrolls
  let visibleSlides = []
  const slideVisibilityChanged = (isVisible, slide) => {
    if (isVisible) {
      visibleSlides.push(slide.slug)
      // Temporarily append URL params to band-aid GA reporting issue
      changeBrowserUrlCustom(`${baseUrl}/${slide.slug}${document.location.search}`)
    } else {
      let index = visibleSlides.indexOf(slide.slug)
      if (index !== -1) {
        visibleSlides.splice(index, 1)
        if (visibleSlides.length === 0 && getLastScrollDirection() === 'up') {
          // Temporarily append URL params to band-aid GA reporting issue
          changeBrowserUrlCustom(`${baseUrl}${document.location.search}`)
        }
      }
    }
  }

  return (
    <React.Fragment>
      {slides.map((item, index) => {
        const hasAd = showDisplayAds && ((index + 1) % 2 === 0 || utmCampaign ? true : false)
        if (hasAd) {
          if (adIndex === 0) adIndex++
          item.slotNum = adIndex > 3 ? adIndex - 3 : 0
          item.slotAu3 = adIndex > 2 ? 'inContent_slot_x' : 'inContent_slot_' + adIndex
          adIndex++
        }
        const hasSuggestedPost = index + 1 === suggestedPostsPosition
        const titleUrl = get(item, 'titleUrl', null)
        return (
          <VisibilitySensor
            key={`gallery-${item.slug}`}
            partialVisibility={true}
            onChange={isVisible => slideVisibilityChanged(isVisible, item)}
            offset={{
              top: window.innerHeight * visibileTopPercentage,
              bottom: window.innerHeight * visibileBottomPercentage,
            }}
          >
            <div ref={item.slug === slideSlug ? scrollToElement : null}>
              {item.__typename === 'ProductSlide' && <ScSeparator />}
              <ScItemNumber>
                {!hideGallerySlideCountNumbers && `${index + 1}/${slides.length}`}
              </ScItemNumber>
              <PostGalleryItem
                image={item.image}
                embedImage={item.embedImage}
                title={item.title}
                content={item.content}
                imageAlt="TBD"
                postTitle={postTitle}
                isProduct={item.__typename === 'ProductSlide'}
                priceType={item.priceType}
                price={item.price}
                priceRange={item.priceRange}
                storeName={item.storeName}
                productLink={item.productLink}
                hideTitle={item.hideTitle}
                titleUrl={titleUrl}
              />
              {hasSuggestedPost && (
                <SuggestedPosts
                  suggestedPosts={post.recommendedPostsCollection.items}
                  categorySlug={get(post, 'mainCategory.slug')}
                  slug={post.slug}
                />
              )}
              {hasAd && (
                <ScAdSlotInContent disabled={!showDisplayAds}>
                  <AdSlot
                    au3={item.slotAu3}
                    number={item.slotNum}
                    lazy
                    teardown={false}
                    appendId={`_${post.sys.id}`}
                    targeting={targeting}
                  />
                </ScAdSlotInContent>
              )}
            </div>
          </VisibilitySensor>
        )
      })}
    </React.Fragment>
  )
}

PostGallery.propTypes = {
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
        priceType: PropTypes.string,
        price: PropTypes.number,
        priceRange: PropTypes.number,
        storeName: PropTypes.string,
        productLink: PropTypes.string,
        __typename: PropTypes.string,
      })
    ),
  }),
  postTitle: PropTypes.string,
  showDisplayAds: PropTypes.bool,
  hideGallerySlideCountNumbers: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  post: PropTypes.shape({}).isRequired,
  incontentAdCount: PropTypes.number,
  targeting: PropTypes.object,
}

PostGallery.defaultProps = {
  galleryData: {},
  postTitle: null,
  showDisplayAds: true,
  hideGallerySlideCountNumbers: false,
  incontentAdCount: 0,
  targeting: {},
}

export default withRouter(PostGallery)
