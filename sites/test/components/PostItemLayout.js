import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import PropTypes, { number } from 'prop-types'
import routes from '../configs/routes'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

import PortionLayout from './PortionLayout'
import PostItemInfo from './PostItemInfo'
import LinkImageBlock, { LinkImageBlockWithPlayIcon } from './LinkImageBlock'
import { COLORS, POST_ITEM_IMAGE_TYPE, withFullWidth } from '../utils/styles'
import ResponsiveImage, {
  ResponsiveImageWithBoxShadow,
} from './ResponsiveImage'

const ScContentWrapper = styled.div`
  align-self: center;

  ${(props) =>
    props.isColumnDirection &&
    `
      margin-left: 0;
      margin-top: ${props.displayCategoryMarginTop};`}
`
const ScPostSeparator = styled.hr`
  width: 100%;
  margin-top: 1.25rem;
  background-color: ${COLORS.GRAY};
`
const ScImageWrapper = styled.div`
  ${(props) =>
    props.withFullWidth &&
    `
    ${withFullWidth}`}
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

/**
 * generate default post data props for post item layout
 * @param {Object<string: any>} post
 * @param {boolean} [withPublishDate = false]
 * @param {boolean} [withCategoryTitle = true]
 * @returns {Object<string: any>}
 */
export function generatePostDataProps(
  post,
  withPublishDate = false,
  withCategoryTitle = true,
  isSponsoredContent = false
) {
  // with show category title
  const displayCategory = get(post, 'displayCategory', {})
  const categoryTitleProps = withCategoryTitle && {
    displayCategoryTitle: isSponsoredContent
      ? 'PROMOTED'
      : displayCategory.title,
    displayCategorySlug: isSponsoredContent ? null : displayCategory.slug,
  }
  // with show publish / update date
  const publishDateProps = withPublishDate &&
    !post.hidePublishDate && {
      updatedDate: post.updatedDate,
      publishDate: post.publishDate,
    }

  return {
    title: post.title,
    slug: post.slug,
    image: post.featuredImage,
    categorySlug: get(post, 'mainCategory.slug'),
    squareCroppingPreference: post.squareCroppingPreference,
    ...publishDateProps,
    ...categoryTitleProps,
  }
}

export function generatePostDataPropsByPromo(
  promo,
  isSponsoredContent = false
) {
  return {
    title: promo.title,
    image: promo.image,
    slug: '',
    categorySlug: '',
    squareCroppingPreference: promo.squareCroppingPreference || 'center',
    displayCategoryTitle: isSponsoredContent
      ? 'PROMOTED'
      : promo.destinationSite.name,
    destinationUrl: promo.destinationUrl,
  }
}

const PostItemLayout = (props) => {
  // device with
  const { isMobile, isTablet, isDesktop } = useContext(DetectDeviceContext)
  let isColumnDirection,
    imageSizeProps,
    mainPortionWidth,
    imageType,
    fullWidth,
    dynamic,
    square,
    isSqrFlex
  // props
  const {
    displayCategoryMarginTop,
    withPlaybuttonSize,
    imageType: imageTypeProps,
    optionsSquareImage,
    optionsFullWidthImage,
    optionsDynamicSizeImage,
    imageResponsiveConfigs: responsive,
    rowGap,
    columnGap,
    onClick,
    ...restPostProps
  } = props

  // image responsive configs
  if (!isEmpty(responsive)) {
    // handle responsive image type with config object
    const config = isMobile
      ? responsive.MOBILE
      : isTablet
      ? responsive.TABLET
      : responsive.DESKTOP
    imageType = get(config, 'imageType')
    square = get(config, 'optionsSquareImage', {})
    fullWidth = get(config, 'optionsFullWidthImage', {})
    dynamic = get(config, 'optionsDynamicSizeImage', {})
    isSqrFlex = get(config, 'isSqrFlex')
  } else {
    // handle image type with props
    imageType = imageTypeProps
    square = optionsSquareImage
    fullWidth = optionsFullWidthImage
    dynamic = optionsDynamicSizeImage
  }

  // shadow options
  const shadowOptions = {
    withShadow: props.withBoxShadow,
  }

  // handle layout options
  switch (imageType) {
    case POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE: {
      const imageWidth =
        square.imageSize || (isMobile ? '120px' : isTablet ? '296px' : '344px')
      // portion layout options
      mainPortionWidth = imageWidth
      isColumnDirection = square.isColumnDirection
      // responsive image options
      imageSizeProps = {
        squareSize: imageWidth,
        squareCroppingPreference: props.squareCroppingPreference,
      }
      break
    }
    case POST_ITEM_IMAGE_TYPE.FULL_WIDTH_IMAGE: {
      // portion layout options
      isColumnDirection = true
      mainPortionWidth = '100%'
      // responsive image options
      imageSizeProps = {
        fixedHeight: fullWidth.imageHeight,
        withFullWidth: true,
      }
      break
    }
    // DYNAMIC_SIZE_IMAGE
    default: {
      // portion layout options
      isColumnDirection = dynamic.isColumnDirection
      mainPortionWidth = dynamic.imageWidth
      // responsive image options
      imageSizeProps = { fixedHeight: dynamic.imageHeight }
      break
    }
  }

  const image = props.image || {}

  // default image options
  const defaultImageProps = {
    title: image.title,
    src: image.url,
    sizes: mainPortionWidth,
    isSqrFlex: isSqrFlex,
    resourceSizeValues: dynamic?.imageSizeValues,
    ...shadowOptions,
    ...imageSizeProps,
  }

  // detect if the post is hovered
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseOver = () => {
    if (isDesktop) setIsHovering(true)
  }

  const handleMouseOut = () => {
    setIsHovering(false)
  }

  const postURL =
    props.destinationUrl ||
    routes.post.pathResolver(props.categorySlug, props.slug)

  // build main content components
  let ImageComponentToRender = null
  const linkImageBlockProps = {
    to: postURL,
    isHovering: isHovering,
    onMouseOver: handleMouseOver,
    onMouseOut: handleMouseOut,
  }

  if (withPlaybuttonSize) {
    ImageComponentToRender = (
      <ScImageWrapper
        withFullWidth={defaultImageProps.withFullWidth}
        onClick={onClick}
      >
        <LinkImageBlockWithPlayIcon
          {...linkImageBlockProps}
          buttonSize={withPlaybuttonSize}
        >
          <ResponsiveImage {...defaultImageProps} />
        </LinkImageBlockWithPlayIcon>
      </ScImageWrapper>
    )
  } else {
    ImageComponentToRender = (
      <ScImageWrapper
        withFullWidth={defaultImageProps.withFullWidth}
        onClick={onClick}
      >
        <LinkImageBlock {...linkImageBlockProps}>
          <ResponsiveImageWithBoxShadow {...defaultImageProps} />
        </LinkImageBlock>
      </ScImageWrapper>
    )
  }

  const InfoComponent = (
    <ScContentWrapper
      isColumnDirection={isColumnDirection}
      displayCategoryMarginTop={displayCategoryMarginTop}
    >
      <PostItemInfo
        isHoveringHeading={isHovering}
        onMouseOverHeading={handleMouseOver}
        onMouseOutHeading={handleMouseOut}
        onClick={onClick}
        {...restPostProps}
      />
    </ScContentWrapper>
  )

  return (
    <div>
      <PortionLayout
        mainSectionSize={mainPortionWidth}
        mainSection={ImageComponentToRender}
        subSection={InfoComponent}
        isColumnDirection={isColumnDirection}
        rowGap={rowGap}
        columnGap={columnGap}
      />
      {props.withSeparator && <ScPostSeparator />}
    </div>
  )
}

PostItemLayout.propTypes = {
  // post props being used in URLs
  categorySlug: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  squareCroppingPreference: PropTypes.string,

  // promo props being used in URLs
  destinationUrl: PropTypes.string,

  // layout props
  withBoxShadow: PropTypes.bool,
  withSeparator: PropTypes.bool,
  withPlaybuttonSize: PropTypes.string,

  // props being passed to children, see default props inside children component
  /* eslint-disable react/require-default-props */
  title: PropTypes.string.isRequired,
  titleColor: PropTypes.string,
  titleHtmlTag: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h4ParentingTitle',
    'suggestedTitle',
  ]),
  titleLines: PropTypes.shape({
    mobileLines: PropTypes.number,
    tabletLines: PropTypes.number,
    desktopLines: PropTypes.number,
  }),
  displayCategoryTitle: PropTypes.string,
  displayCategoryMarginTop: PropTypes.string,
  displayCategoryTitleColor: PropTypes.string,
  isDisplayCategoryTitleBold: PropTypes.bool,
  updatedDate: PropTypes.string,
  publishDate: PropTypes.string,
  /* eslint-enable */

  // image props
  imageType: PropTypes.oneOf([
    POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE,
    POST_ITEM_IMAGE_TYPE.FULL_WIDTH_IMAGE,
    POST_ITEM_IMAGE_TYPE.DYNAMIC_SIZE_IMAGE,
  ]),
  optionsSquareImage: PropTypes.shape({
    imageSize: PropTypes.string,
    isColumnDirection: PropTypes.bool,
  }),
  optionsFullWidthImage: PropTypes.shape({
    imageHeight: PropTypes.string,
  }),
  optionsDynamicSizeImage: PropTypes.shape({
    imageWidth: PropTypes.string,
    imageHeight: PropTypes.string,
    imageSizeValues: PropTypes.arrayOf(number),
    isColumnDirection: PropTypes.bool,
  }),
  // uses image configs as same as props
  // but specific for each device
  imageResponsiveConfigs: PropTypes.shape({
    MOBILE: PropTypes.object,
    TABLET: PropTypes.object,
    DESKTOP: PropTypes.object,
  }),
  rowGap: PropTypes.string,
  columnGap: PropTypes.string,
  isSqrFlex: PropTypes.bool,
  onClick: PropTypes.func,
}

PostItemLayout.defaultProps = {
  // styling props
  displayCategoryMarginTop: '20px',
  displayCategoryTitleColor: COLORS.LT_DARK_PEACH,
  // layout props
  withBoxShadow: false,
  withSeparator: false,
  withPlaybuttonSize: null, // used in video section

  // promo props
  destinationUrl: null,

  // image props
  imageType: POST_ITEM_IMAGE_TYPE.DYNAMIC_SIZE_IMAGE,
  optionsSquareImage: {
    imageSize: null,
    isColumnDirection: false,
  },
  optionsFullWidthImage: {
    imageHeight: null,
  },
  optionsDynamicSizeImage: {
    imageWidth: null,
    imageHeight: null,
    imageSizeValues: null,
    isColumnDirection: false,
  },
  imageResponsiveConfigs: {},
  squareCroppingPreference: 'center',
  rowGap: '0',
  columnGap: '1.44rem',
  isSqrFlex: false,
  onClick: () => {},
}

export default PostItemLayout
