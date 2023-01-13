import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import template from 'lodash/template'
import has from 'lodash/has'
import isNull from 'lodash/isNull'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ResponsiveImage from '../ResponsiveImage'
import ContentMarkdown from 'wsc/components/post/ContentMarkdown'
import EmbedImage from 'wsc/components/post/EmbedImage'
import { ShopButton } from '../button/ShopButton'
import Link from 'wsc/components/Link'
import LinkHeading from '../LinkHeading'

import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { useTranslator } from '../../hooks/useTranslator'
import { PinterestButton } from 'wsc/utils/pinterest'
import {
  COLORS,
  MEDIA,
  withFullscreenOnMobile,
  withResponsiveHidden,
  FONT_FAMILIES,
} from '../../utils/styles'
import { priceFormat } from 'wsc/utils/number'

const ScOverlayBox = styled.div`
  background: ${COLORS.BLACK};
  opacity: 0.5;
`
const ScImageBox = styled.figure`
  width: 100%;
  margin-bottom: 0;
  overflow: hidden;
  position: relative;

  // background image
  > img:first-child {
    position: absolute;
    z-index: -2;
    filter: blur(2px);
    height: 100%;
  }

  > ${ScOverlayBox} {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  // main image
  > img:last-child {
    object-fit: contain;
  }

  ${withFullscreenOnMobile}
`
const ScImageWrapper = styled.div`
  position: relative;
  margin-bottom: 2rem;
  ${props => props.haveSource && `margin-bottom: 0.75rem`}
`
const ScImageCaption = styled.figcaption.attrs({
  className: 'font-description',
})`
  color: ${COLORS.GREY};
  text-align: right;
  min-height: 20px;
  margin-top: 4px;

  ${MEDIA.MOBILE`
    margin-top: 3px;
    margin-bottom: 6px;`}
  ${MEDIA.TABLET`margin-bottom: 2px;`}
`
const ScLink = styled(Link)`
  ${MEDIA.DESKTOP`
    &:hover {
      text-decoration: underline;
    }
  `}
`
const ScTitle = styled.h2`
  ${props => props.marginBottom && `margin-bottom: ${props.marginBottom}`}
`
// product components
const ScProductTitleFlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  ${MEDIA.MOBILE`margin-bottom: 20px;`}
`
const ScProductInfoFlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  ${MEDIA.MOBILE`margin-bottom: 20px;`}
`
const ScProductSubTitle = styled.span`
  font-family: ${FONT_FAMILIES.POPPINS};
  width: calc(100% - 122px);
`
const ScProductStoreName = styled(Link)`
  font-family: ${FONT_FAMILIES.POPPINS};
`
const ScProductSpaceForNoContent = styled.div`
  padding-bottom: 40px;
  ${MEDIA.DESKTOP`padding-bottom: 50px`};
`
const ScProductShopButton = styled(({ hideOnTablet, existOnTablet, ...restProps }) => (
  <ShopButton {...restProps} />
))`
  // always on bottom line
  ${props =>
    withResponsiveHidden({ hideOnTablet: props.hideOnTablet, existOnTablet: props.existOnTablet })}
`

/*----------------------------------------------------------------------------------
 *  COMPONENTS
 *---------------------------------------------------------------------------------*/
const PRICE_TEXT_TEMPLATE = {
  singlePrice: translator => template(translator('postGallery.singlePrice')),
  startingPrice: translator => template(translator('postGallery.startingPrice')),
  rangingPrice: translator => template(translator('postGallery.rangingPrice')),
  varies: translator => template(translator('postGallery.varies')),
}

const HeaderMediaItem = props => {
  let marginBottom = '24px'

  return !props.titleUrl ? (
    <ScTitle marginBottom={marginBottom}>{props.title}</ScTitle>
  ) : (
    <ScLink withDefaultStyle={false} to={props.titleUrl}>
      <ScTitle marginBottom={marginBottom}>{props.title}</ScTitle>
    </ScLink>
  )
}

HeaderMediaItem.propTypes = {
  title: PropTypes.string,
  titleUrl: PropTypes.string,
}

HeaderMediaItem.defaultProps = { title: null, titleUrl: null }

const HeaderProductItem = props => {
  const { isDesktop } = useContext(DetectDeviceContext)
  const { translator } = useTranslator()
  const { productLink, storeName } = props
  let { priceType, price, priceRange } = props
  // Set default value for old product slide entries.
  if (isNull(priceType) || !has(PRICE_TEXT_TEMPLATE, priceType)) {
    priceType = 'singlePrice'
  }

  if (price === null) {
    price = 0
  }

  if (priceRange === null) {
    priceRange = 0
  }

  const priceText = PRICE_TEXT_TEMPLATE[priceType](translator)({
    price: priceFormat(price),
    priceRange: priceFormat(priceRange),
  })

  // detect if the product title is hovered
  const [isHovering, setIsHovering] = useState(false)
  const handleMouseOver = () => {
    if (isDesktop) setIsHovering(true)
  }
  const handleMouseOut = () => {
    setIsHovering(false)
  }

  return (
    <React.Fragment>
      <div>
        <ScProductTitleFlexWrapper>
          <LinkHeading
            to={productLink}
            isHovering={isHovering}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            noneBorder={true} // not used default border-bottom : color yellow
          >
            <ScTitle marginBottom={'0'}>{props.title}</ScTitle>
          </LinkHeading>
        </ScProductTitleFlexWrapper>

        <ScProductInfoFlexWrapper>
          <ScProductSubTitle>
            {`${priceText}`}{' '}
            <span style={{ fontStyle: 'italic' }}>{translator('postGallery.from')}</span>{' '}
            <ScProductStoreName to={productLink}>{storeName}</ScProductStoreName>
          </ScProductSubTitle>
          <ScProductShopButton href={productLink} target="_blank" rel="noopener">
            {translator('postGallery.shop')}
          </ScProductShopButton>
        </ScProductInfoFlexWrapper>
      </div>
      {props.isContentEmpty && <ScProductSpaceForNoContent />}
    </React.Fragment>
  )
}
HeaderProductItem.propTypes = {
  priceType: PropTypes.string,
  price: PropTypes.number,
  priceRange: PropTypes.number,
  title: PropTypes.string,
  storeName: PropTypes.string,
  productLink: PropTypes.string,
  isContentEmpty: PropTypes.bool,
}
HeaderProductItem.defaultProps = {
  priceType: 'singlePrice',
  price: 0,
  priceRange: 0,
  title: null,
  storeName: null,
  productLink: null,
  isContentEmpty: false,
}
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const PostGalleryItem = ({
  isProduct,
  image,
  embedImage,
  title,
  content,
  imageAlt,
  postTitle,
  hideTitle,
  titleUrl,
  ...restProductProps
}) => {
  const { isDesktop, isTablet } = useContext(DetectDeviceContext)
  const imageUrl = get(image, 'url')
  const imageTitle = get(image, 'title')
  const imageDesc = get(image, 'description')

  // display header related to type of gallery item
  const headerComponent = isProduct ? (
    <HeaderProductItem
      title={hideTitle === true ? '' : title}
      isContentEmpty={isEmpty(content)}
      {...restProductProps}
    />
  ) : (
    <HeaderMediaItem title={hideTitle === true ? '' : title} titleUrl={titleUrl} />
  )

  return (
    <section>
      {imageUrl && (
        <ScImageWrapper haveSource={image.description ? true : false}>
          <PinterestButton
            postTitle={postTitle}
            itemTitle={title}
            itemImageUrl={image.url}
            itemImageTitle={image.title}
            itemImageDesc={image.description}
            itemContent={content}
          />
          <ScImageBox>
            <ResponsiveImage alt={imageDesc} title={imageTitle} src={imageUrl} />
            <ScOverlayBox />
            <ResponsiveImage
              title={imageTitle}
              alt={imageDesc}
              src={imageUrl}
              maxHeight={isDesktop ? '725.25px' : isTablet ? '608px' : '1200px'}
            />
          </ScImageBox>
          <ScImageCaption>{image.description}</ScImageCaption>
        </ScImageWrapper>
      )}
      {embedImage && <EmbedImage htmlCode={embedImage} />}
      {headerComponent}
      <ContentMarkdown content={content} />
    </section>
  )
}

PostGalleryItem.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  imageAlt: PropTypes.string,
  image: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    description: PropTypes.string,
  }),
  embedImage: PropTypes.string, // markdown format
  // product props
  isProduct: PropTypes.bool,
  priceType: PropTypes.string,
  price: PropTypes.number,
  priceRange: PropTypes.number,
  storeName: PropTypes.string,
  productLink: PropTypes.string,
  postTitle: PropTypes.string,
  hideTitle: PropTypes.bool,
  titleUrl: PropTypes.string,
}

PostGalleryItem.defaultProps = {
  imageAlt: null,
  image: null,
  embedImage: null,
  title: null,
  content: null,
  // product props
  isProduct: false,
  priceType: 'singlePrice',
  price: 0,
  priceRange: 0,
  storeName: null,
  productLink: null,
  postTitle: null,
  hideTitle: false,
  titleUrl: null,
}

export default PostGalleryItem
