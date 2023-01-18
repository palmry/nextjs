import React, { useState, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import VisibilitySensor from 'react-visibility-sensor'
import styled from 'styled-components'
import get from 'lodash/get'
import Carousel from 'nuka-carousel'

import Link from 'wsc/components/Link'
import { MEDIA, COLORS, FONT_FAMILIES, withFullWidth } from 'wsc/utils/styles'
import {
  PostNavContext,
  getPostItems,
  getCurrentIndex,
  getNextPost,
  getPreviousPost,
} from 'wsc/components/context/PostNavProvider'
import { getActivePost } from '../../utils/activePost'
import { ScCircleArrowRight, ScCircleArrowLeft } from '../styled/ScCircleArrow'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import RightArrow from '../../statics/images/icon-nav-right.svg'
import CalendarIcon from '../../statics/images/icon-calendar.svg'

const ScCalendarIcon = styled((props) => <CalendarIcon {...props} />)`
  display: block;
  fill: var(--withImageBoxShadow_boxShadowColor, ${COLORS.LIGHT_BLUE});
  width: 67px;
  height: 65px;
  margin: 0 auto;
`

const ScPostNavCarousel = styled.section`
  * {
    outline: 0;
  }
  margin-top: 50px;
  ${MEDIA.DESKTOP`margin-top:70px;`}
  ${MEDIA.TABLET`margin-top:70px;`}
  .PostSlider {
    ${MEDIA.DESKTOP`width:88.5%;left:auto;right:auto;margin:auto;`}
    ${MEDIA.TABLET`width:92.8%;left:auto;right:auto;margin:auto;`}
  }
  > h2 {
    font-family: ${FONT_FAMILIES.SERIF};
    font-style: italic;
    font-size: 1.875rem;
    ${MEDIA.MOBILE`font-size: 1.35rem;`}
    font-weight: normal;
    text-align: center;
    margin: 20px auto;
  }
  h3 {
    font-size: 0.938rem;
    margin-top: 0.75rem;
  }
  .slider {
    padding-bottom: 30px;
    h2 {
      font-size: 0.938rem;
      text-align: center;
    }
    .slider-slide {
      h3 {
        margin-top: 0;
        text-align: center;
      }
    }
  }
  .SliderDot {
    margin: 0 5px;
    > div {
      background-color: ${COLORS.LIGHT_GRAY};
    }
  }
`
const ScFeaturedImagePostCarouselControl = styled.button`
  width: 15px;
  height: 50px;
  border: 0 solid;
  outline: 0;
  position: absolute;
  background-color: transparent;
  top: -50px;
  cursor: pointer;
  ${(props) => (props.direction === 'left' ? 'left: -25px;' : 'right: -25px;')}
  svg {
    height: 15px;
    width: 9px;
    transform: rotate(
      ${(props) => (props.direction === 'left' ? '180deg' : '0deg')}
    );
  }
`

const ScCircularImagePostCarousel = styled.section`
  ${MEDIA.MOBILE`${withFullWidth}`}

  * {
    outline: 0;
  }
`

const ScCircularImagePostCarouselHeader = styled.section`
  background-color: var(
    --withImageBoxShadow_boxShadowColor,
    ${COLORS.LIGHT_BLUE}
  );
  padding: 24px 0 14px 0;
  text-align: center;

  h2 {
    font-weight: bold;
    font-size: 1.25rem;
    color: ${COLORS.WHITE};
  }
  section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
    a {
      svg {
        height: 40px;
        width: 40px;
      }
      &:hover,
      &:active {
        svg {
          background-color: ${COLORS.rgba(COLORS.WHITE, '0.6')};
        }
      }
    }
    svg {
      height: 40px;
      width: 40px;
    }
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      margin: 0 23px;
      ${MEDIA.MOBILE`margin: 0 8px;`}
    }
  }
  .toggleButton {
    font-size: 0.75rem;
    line-height: 0.75rem;
    color: ${COLORS.WHITE};
    cursor: pointer;
    .chevron {
      position: relative;
      display: inline-block;
      margin-left: 5px;
      height: 10px;
      width: 10px;
      bottom: -2px;
      transform: rotate(-90deg);
      fill: ${COLORS.WHITE};
      &.closed {
        transform: rotate(90deg);
      }
    }
  }
`

const ScCircleListItem = styled.li`
  background: url('${(props) => props.imagePath}') no-repeat center;
  background-size: cover;
  border: 3px solid ${COLORS.WHITE};
  width: 135px;
  height: 135px;
  border-radius: 100%;
  list-style: none;
  a {
    height: 100%;
    width: 100%;
    outline: 0;
    text-decoration: none;
    border: 0 solid;
    color: ${COLORS.WHITE};
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 100%;
    &:hover,
    &:active {
      background-color: ${COLORS.rgba(COLORS.BLACK, '0.3')};
    }
  }
`

const ScCircularImagePostNavDrawer = styled.section`
  background-color: var(
    --CircularPostNavCarousel_backgroundColor,
    ${COLORS.SOFT_BLUE}
  );
  display: flex;
  padding: 20px 20px 40px 20px;
  ${MEDIA.MOBILE`padding:20px 0 40px 0;`}
  ${MEDIA.DESKTOP`padding-bottom:20px;`}
  align-items: center;
  justify-content: center;
  .slider {
    .slider-list {
      ${(props) =>
        props.hideArrows &&
        `
        display:flex !important;
        justify-content: center;
      `}
      li {
        ${MEDIA.MOBILE`transform: translateX(10px) !important;`}
        ${MEDIA.DESKTOP`transform: translateX(5px) !important;`}
        ${(props) =>
          props.hideArrows &&
          `
          position:relative !important;
          left: auto !important;
        `}
      }
    }
    .slider-control-bottomcenter {
      height: 8px;
      bottom: -20px !important;
      svg {
        width: 8px;
        height: 8px;
        margin: 0 5px;
        circle {
          r: 4;
          cy: 4;
          cx: 4;
          fill: ${COLORS.WHITE};
        }
      }
    }
    .slider-control-centerleft,
    .slider-control-centerright {
      &:hover,
      &:active {
        svg {
          background-color: ${COLORS.rgba(COLORS.WHITE, '0.6')};
        }
      }
    }
  }
`

const ScCircularImagePostNavDrawerItem = styled.div`
  border-radius: 100%;
  border: 1px solid ${COLORS.WHITE};
  height: 74px;
  width: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    border: 0 solid;
    color: ${COLORS.WHITE};
    font-size: 0.75rem;
    height: 100%;
    width: 100%;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover,
    &:active {
      background-color: ${COLORS.WHITE};
      color: ${COLORS.SOFT_BLUE};
    }
  }
`

const getCarouselPostItems = (currentIndex, items) => {
  if (currentIndex === null || !items) return null
  return items
    .slice(currentIndex)
    .concat(items.slice(0, currentIndex))
    .slice(1)
    .map((item) => {
      item.post.title = item.title
      item.post.path = item.path
      return item.post
    })
}

const CircularImagePostCarousel = (props) => {
  const { currentPost, translator, carouselPostItems } = props
  const { isMobile } = useContext(DetectDeviceContext)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const postItems = getPostItems(currentPost)
  const currentIndex = getCurrentIndex(currentPost, postItems)
  const nextPost = getNextPost(currentIndex, postItems)
  const previousPost = getPreviousPost(currentIndex, postItems)

  if (!nextPost || !previousPost) return null

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)
  const toggleButtonTitle = translator
    ? translator('postPage.jumpTo')
    : 'Jump to'
  const titlePrefix = translator ? translator('postPage.moreFrom') : 'More From'
  const hideDrawer = carouselPostItems.length < 4 ? true : false

  return (
    <ScCircularImagePostCarousel>
      <ScCircularImagePostCarouselHeader>
        <h2>
          {titlePrefix}{' '}
          {get(
            currentPost,
            'multipleSeriesCollection.items[0].contentNavigation.name',
            'Series'
          )}
        </h2>
        <section>
          {!isMobile && !hideDrawer && (
            <Link to={previousPost.path} withDefaultStyle={false}>
              <ScCircleArrowLeft />
            </Link>
          )}
          <ul>
            <ScCircleListItem
              imagePath={
                previousPost?.thumbnail?.url ||
                previousPost.post.featuredImage.url
              }
            >
              <Link to={previousPost.path}>{previousPost.title}</Link>
            </ScCircleListItem>
            {!hideDrawer && (
              <ScCircleListItem
                imagePath={
                  nextPost?.thumbnail?.url || nextPost.post.featuredImage.url
                }
              >
                <Link to={nextPost.path}>{nextPost.title}</Link>
              </ScCircleListItem>
            )}
          </ul>
          {!isMobile && !hideDrawer && (
            <Link to={nextPost.path} withDefaultStyle={false}>
              <ScCircleArrowRight />
            </Link>
          )}
        </section>
        {!hideDrawer && (
          <div className='toggleButton' onClick={toggleDrawer}>
            {toggleButtonTitle}
            <RightArrow
              className={`chevron ${isDrawerOpen ? 'open' : 'closed'}`}
            />
          </div>
        )}
      </ScCircularImagePostCarouselHeader>
      {isDrawerOpen && <CircularImagePostCarouselDrawer {...props} />}
    </ScCircularImagePostCarousel>
  )
}

const CircularImagePostCarouselDrawer = (props) => {
  const { carouselPostItems } = props
  const { isDesktop, isMobile } = useContext(DetectDeviceContext)
  const hideArrows =
    isMobile && carouselPostItems.length < 4
      ? true
      : !isMobile && carouselPostItems.length < 7
      ? true
      : false

  return (
    <ScCircularImagePostNavDrawer hideArrows={hideArrows}>
      <Carousel
        wrapAround={true}
        slidesToShow={isMobile ? 4.4 : isDesktop ? 7 : 6}
        cellAlign='left'
        cellSpacing={1}
        scrollMode='remainder'
        dragging={!hideArrows}
        framePadding={!isMobile ? '0 40px' : '0'}
        slidesToScroll={isMobile ? 4.4 : 4}
        renderCenterLeftControls={({
          previousSlide,
          goToSlide,
          currentSlide,
          slideCount,
        }) =>
          !isMobile &&
          !hideArrows && (
            <ScCircleArrowLeft
              onClick={() => {
                //this is here to mitigate the blank slide issue documented here
                //https://github.com/FormidableLabs/nuka-carousel/issues/755
                //when that issue is resolved we can remove and replace with previousSlide
                const prevSlide = currentSlide > 1 ? currentSlide - 2 : null
                if (prevSlide) {
                  goToSlide(prevSlide)
                } else {
                  previousSlide()
                }
              }}
            />
          )
        }
        renderCenterRightControls={({ nextSlide }) =>
          !isMobile && !hideArrows && <ScCircleArrowRight onClick={nextSlide} />
        }
        renderBottomCenterControls={isDesktop || hideArrows ? null : undefined}
      >
        {carouselPostItems.map((item, index) => (
          <ScCircularImagePostNavDrawerItem key={index}>
            <Link to={item.path}>{item.title}</Link>
          </ScCircularImagePostNavDrawerItem>
        ))}
      </Carousel>
    </ScCircularImagePostNavDrawer>
  )
}

const FeaturedImagePostCarouselControl = (props) => {
  const { onClick, postAmount, direction } = props
  const { isMobile } = useContext(DetectDeviceContext)
  if (!postAmount || isMobile) return null

  return (
    <ScFeaturedImagePostCarouselControl onClick={onClick} direction={direction}>
      <RightArrow />
    </ScFeaturedImagePostCarouselControl>
  )
}

const FeaturedImagePostCarousel = (props) => {
  const { CarouselComponent, currentPost, carouselPostItems, translator } =
    props
  const { isDesktop, isMobile } = useContext(DetectDeviceContext)
  const titlePrefix = translator ? translator('postPage.moreFrom') : 'More From'

  return (
    <ScPostNavCarousel>
      <ScCalendarIcon />
      <h2>
        {titlePrefix}{' '}
        {get(
          currentPost,
          'multipleSeriesCollection.items[0].contentNavigation.name',
          'Series'
        )}
      </h2>
      <CarouselComponent
        posts={carouselPostItems}
        wrapAround={true}
        slidesToShow={isMobile ? 1.3723 : 3}
        slideWidth={1}
        cellAlign='center'
        cellSpacing={12}
        disablePlayIcon={true}
        renderCenterLeftControls={({ currentSlide, previousSlide }) => (
          <FeaturedImagePostCarouselControl
            onClick={previousSlide}
            currentSlide={currentSlide}
            postAmount={carouselPostItems.length}
            direction={'left'}
          />
        )}
        renderCenterRightControls={({ currentSlide, nextSlide }) => (
          <FeaturedImagePostCarouselControl
            onClick={nextSlide}
            currentSlide={currentSlide}
            postAmount={carouselPostItems.length}
            direction={'right'}
          />
        )}
        disableDotControls={isMobile ? false : true}
        imageHeight={isMobile ? '152px' : isDesktop ? '116px' : '100px'}
        displayCategoryMarginTop='10px'
      />
    </ScPostNavCarousel>
  )
}

export const PostNavCarousel = (props) => {
  const { currentPost } = props
  const { setIsShowPostNavBar, isPostBarVisible } = useContext(PostNavContext)
  const postItems = getPostItems(currentPost)
  const childRef = useRef(null)
  if (postItems === null || postItems.length < 2) return null
  const currentIndex = getCurrentIndex(currentPost, postItems)
  const carouselPostItems = getCarouselPostItems(currentIndex, postItems)
  const navigationType = get(
    currentPost,
    'multipleSeriesCollection.items[0].contentNavigation.navigationType'
  )
  const ComponentToRender =
    navigationType === 'Circular Thumbnail'
      ? CircularImagePostCarousel
      : FeaturedImagePostCarousel

  return (
    carouselPostItems && (
      <VisibilitySensor
        partialVisibility={'top'}
        onChange={(isVisible) => {
          const isActivePost = currentPost.sys.id === getActivePost().sys.id
          const isAboveViewport =
            childRef.current.getBoundingClientRect().top < 0

          if (isActivePost) {
            if (isVisible) setIsShowPostNavBar(false)
            else {
              if (isAboveViewport) {
                setIsShowPostNavBar(false)
              } else if (!isPostBarVisible(currentPost.sys.id)) {
                setIsShowPostNavBar(true)
              }
            }
          }
        }}
        intervalCheck={true}
        intervalDelay={50}
        scrollCheck={true}
        scrollThrottle={20}
        minTopValue={200}
        delayedCall={false}
      >
        <div ref={childRef}>
          <ComponentToRender {...props} carouselPostItems={carouselPostItems} />
        </div>
      </VisibilitySensor>
    )
  )
}

PostNavCarousel.propTypes = {
  CarouselComponent: PropTypes.func,
  currentPost: PropTypes.object,
  carouselPostItems: PropTypes.array,
  translator: PropTypes.func,
}

PostNavCarousel.defaultProps = {
  CarouselComponent: null,
  currentPost: null,
  carouselPostItems: null,
  translator: null,
}
