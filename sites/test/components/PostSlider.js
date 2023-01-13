import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Carousel from 'nuka-carousel'

import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import PostItemLayout, { generatePostDataProps } from './PostItemLayout'
import { withFullWidth, COLORS } from '../utils/styles'

const ScContentWrapper = styled.div`
  ${withFullWidth}
`
const ScDotBox = styled.div`
  display: flex;
`
const ScDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  background-color: ${COLORS.WHITE};
  opacity: 0.5;
  margin: 0 0.31rem;
  border-radius: 0.5rem;
  ${props => props.isDotActive && `opacity: 1;`}
`
const ScFrame = styled.div`
  // margin between content and dot
  margin-bottom: 40px;
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SliderDot = ({ onClick, currentSlide, postAmount }) => {
  if (!postAmount) return null

  let dots = []
  for (let i = 0; i < postAmount; i++) {
    dots.push(
      <ScDot key={`dots-${i}`} onClick={onClick.bind(null, i)} isDotActive={i === currentSlide} />
    )
  }
  return <ScDotBox className="SliderDot">{dots}</ScDotBox>
}

SliderDot.propTypes = {
  onClick: PropTypes.func,
  currentSlide: PropTypes.number,
  postAmount: PropTypes.number,
}

SliderDot.defaultProps = {
  onClick: () => {},
  currentSlide: null,
  postAmount: null,
}

const PostSlider = props => {
  const { isMobile } = useContext(DetectDeviceContext)
  const { disablePlayIcon, disableDotControls, imageHeight } = props
  // validate given posts
  if (isEmpty(props.posts)) return null

  const settings = {
    wrapAround: props.wrapAround,
    slidesToShow: props.slidesToShow,
    slidesToScroll: props.slidesToScroll,
    slideIndex: props.slideIndex,
    slideWidth: props.slideWidth,
    cellAlign: props.cellAlign,
    cellSpacing: props.cellSpacing,
    renderCenterLeftControls: props.renderCenterLeftControls,
    renderCenterRightControls: props.renderCenterRightControls,
  }

  return (
    <ScContentWrapper className="PostSlider">
      <Carousel
        renderBottomCenterControls={
          !disableDotControls
            ? ({ currentSlide, goToSlide }) => (
                <SliderDot
                  onClick={goToSlide}
                  currentSlide={currentSlide}
                  postAmount={props.posts.length}
                />
              )
            : null
        }
        {...settings}
      >
        {props.posts.map(post => {
          return (
            <ScFrame key={`slider-${post.slug}`}>
              <PostItemLayout
                {...generatePostDataProps(post, false, false)}
                // styling
                titleHtmlTag={isMobile ? 'h3' : 'h2'}
                optionsDynamicSizeImage={{
                  imageHeight: imageHeight || (isMobile ? '11.88rem' : '21.38rem'),
                  imageWidth: isMobile ? '21.19rem' : '38.00rem',
                  isColumnDirection: true,
                }}
                withPlaybuttonSize={disablePlayIcon ? null : isMobile ? '3.13rem' : '4.69rem'}
                displayCategoryMarginTop={props.displayCategoryMarginTop}
              />
            </ScFrame>
          )
        })}
      </Carousel>
    </ScContentWrapper>
  )
}

PostSlider.propTypes = {
  wrapAround: PropTypes.bool,
  slidesToShow: PropTypes.number,
  slidesToScroll: PropTypes.number,
  slideIndex: PropTypes.number,
  slideWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cellAlign: PropTypes.oneOf(['left', 'center', 'right']),
  cellSpacing: PropTypes.number,
  renderCenterLeftControls: PropTypes.any,
  renderCenterRightControls: PropTypes.any,
  disableDotControls: PropTypes.bool,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      posts: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          slug: PropTypes.string,
          publishDate: PropTypes.string,
          updatedDate: PropTypes.string,
          featuredImage: PropTypes.shape({
            url: PropTypes.string,
          }),
          displayCategory: PropTypes.shape({
            title: PropTypes.string,
            slug: PropTypes.string,
          }),
          mainCategory: PropTypes.shape({
            slug: PropTypes.string,
          }),
        })
      ),
    })
  ),
  disablePlayIcon: PropTypes.bool,
  imageHeight: PropTypes.string,
  displayCategoryMarginTop: PropTypes.string,
}

// reference for props description : https://github.com/FormidableLabs/nuka-carousel
PostSlider.defaultProps = {
  posts: [],
  wrapAround: false, // Sets infinite wrapAround mode.
  slidesToShow: 1.25, // Number of slides to show at once
  slidesToScroll: 1,
  slideIndex: 0,
  slideWidth: 611, // Manually set slideWidth. If you want hard pixel widths, use a string like slideWidth="20px",
  // and if you prefer a percentage of the container, use a decimal integer like slideWidth={0.8}
  cellAlign: 'center', // ['left', 'center', 'right']
  cellSpacing: 16, // spacing between cells, reflected as px
  renderCenterLeftControls: null, // rendering controls in CenterLeft positions
  renderCenterRightControls: null, // rendering controls in CenterRight positions
  disableDotControls: false,
  disablePlayIcon: false, //hides play button included on slides
  imageHeight: null,
  displayCategoryMarginTop: '20px',
}

export default PostSlider
