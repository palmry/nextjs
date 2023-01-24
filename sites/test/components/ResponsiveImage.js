import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes, { number } from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

import {
  createSrcSet,
  IMG_SRCSET_WIDTH_CONFIGS,
  IMG_QUALITY,
  IMG_FORMAT,
} from 'wsc/utils/responsiveImg'
import { withImageBoxShadow, withFullWidth, PAGE_WIDTHS } from '../utils/styles'
import ImageLoader from './ImageLoader'

const ScImageSqrFlex = styled.div`
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  ${(props) =>
    `
    object-position: ${props.squareCroppingPreference};
  `}
`
const ScImageShadow = styled.div`
  width: 100%;
  align-self: flex-start;
  ${(props) => props.withShadow && withImageBoxShadow}
  ${(props) => props.withFullWidth && withFullWidth}

  /* circle option */
  ${(props) =>
    props.isCircle &&
    `
    border-radius: 50%;
  `}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

/* __ WORKS WITH CONTENTFUL IMAGE ONLY __ */
const ResponsiveImage = (props) => {
  const { isTablet, isDesktop } = () => useContext(DetectDeviceContext)
  let imageSizeValues = props.resourceSizeValues
  if (!imageSizeValues) imageSizeValues = IMG_SRCSET_WIDTH_CONFIGS
  const formattedImgObj = createSrcSet(
    props.src,
    props.squareSize ? true : false,
    props.squareCroppingPreference,
    imageSizeValues,
    props.resourceSizeRules,
    props.imgQuality,
    props.imgFormat
  )
  const title = props.title
  // image sizes for handle srcset
  const sizes =
    props.sizes ||
    (isDesktop
      ? `${PAGE_WIDTHS.DESKTOP}px`
      : isTablet
      ? `${PAGE_WIDTHS.TABLET}px`
      : '100vw')

  const imageProps = {
    alt: title,
    title: title,
    src: formattedImgObj.src,
    placeholderSrc: formattedImgObj.placeholderSrc,
    placeholderSrcSet: formattedImgObj.placeholderSrcSet,
    srcSet: formattedImgObj.srcSet,
    sizes: sizes,
    maxWidth: props.maxWidth,
    maxHeight: props.maxHeight,
    fixedHeight: props.fixedHeight,
    fixedWidth: props.fixedWidth,
    squareSize: props.squareSize,
    squareCroppingPreference: props.squareCroppingPreference,
    isCircle: props.isCircle,
    isSqrFlex: props.isSqrFlex,
    activeLoad: props.activeLoad,
    imgQuality: props.imgQuality,
    imgFormat: props.imgFormat,
  }

  return props.isSqrFlex ? (
    <ScImageSqrFlex>
      <ImageLoader {...imageProps} />
    </ScImageSqrFlex>
  ) : (
    <ImageLoader {...imageProps} />
  )
}

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  sizes: PropTypes.string,
  maxWidth: PropTypes.string,
  maxHeight: PropTypes.string,
  fixedHeight: PropTypes.string,
  fixedWidth: PropTypes.string,
  resourceSizeValues: PropTypes.arrayOf(number),
  resourceSizeRules: PropTypes.arrayOf(String),
  squareSize: PropTypes.string,
  squareCroppingPreference: PropTypes.oneOf([
    'none',
    'left',
    'center',
    'right',
  ]),
  isCircle: PropTypes.bool,
  isSqrFlex: PropTypes.bool,
  activeLoad: PropTypes.bool,
  imgQuality: PropTypes.number,
  imgFormat: PropTypes.string,
}

ResponsiveImage.defaultProps = {
  alt: null,
  title: null,
  sizes: null,
  maxWidth: null,
  maxHeight: null,
  fixedHeight: null,
  fixedWidth: null,
  resourceSizeValues: IMG_SRCSET_WIDTH_CONFIGS,
  resourceSizeRules: null,
  squareSize: null,
  squareCroppingPreference: 'center',
  isCircle: false,
  isSqrFlex: false,
  activeLoad: false,
  imgQuality: IMG_QUALITY,
  imgFormat: IMG_FORMAT,
}

export default ResponsiveImage

// Add-on component on-top of <ResponsiveImage>
export const ResponsiveImageWithBoxShadow = ({
  withShadow,
  withFullWidth,
  isStaticShadowLength,
  isCircle,
  ...restProps
}) => (
  <ScImageShadow
    withFullWidth={withFullWidth}
    withShadow={withShadow}
    isStaticShadowLength={isStaticShadowLength}
    isCircle={isCircle}
  >
    <ResponsiveImage isCircle={isCircle} {...restProps} />
  </ScImageShadow>
)

ResponsiveImageWithBoxShadow.propTypes = {
  withShadow: PropTypes.bool,
  withFullWidth: PropTypes.bool,
  isStaticShadowLength: PropTypes.bool,
  isCircle: PropTypes.bool,
  // props which are forwarded to a child component:
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  sizes: PropTypes.string,
  fixedHeight: PropTypes.string,
  maxHeight: PropTypes.string,
  squareSize: PropTypes.string,
}

ResponsiveImageWithBoxShadow.defaultProps = {
  withShadow: true,
  withFullWidth: false,
  isStaticShadowLength: true,
  isCircle: false,
  // default props which are forwarded to a child component:
  alt: null,
  title: null,
  sizes: null,
  fixedHeight: null,
  maxHeight: null,
  squareSize: null,
}
