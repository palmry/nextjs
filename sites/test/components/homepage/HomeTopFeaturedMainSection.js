import isEmpty from 'lodash/isEmpty'

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import PostItemLayout, {
  generatePostDataProps,
  generatePostDataPropsByPromo,
} from '../PostItemLayout'

import { COLORS, MEDIA, POST_ITEM_IMAGE_TYPE } from '../../utils/styles'

const ScContainer = styled.div`
  margin-bottom: 0px;
  ${MEDIA.TABLET`
    position: relative;
    padding-top: 40px;
    padding-bottom: 40px;
  `}
  ${MEDIA.MOBILE`
    position: relative;
    padding-bottom: 24px;
  `}
`
const ScGreenBgWrapper = styled.div`
  ${MEDIA.TABLET`
    background-color: ${COLORS.LT_DARK_PEACH};
    position: absolute;
    display: flex;
    box-sizing: border-box;
    margin: 0 auto;
    margin-left: -50vw;
    margin-right: -50vw;
    left: 50%;
    right: 50%;
    width: 100vw;
    height: 100%;
    top: 0;
    z-index: -1;
    overflow: hidden;
  `}
  ${MEDIA.MOBILE`
    background-color: ${COLORS.LT_DARK_PEACH};
    position: absolute;
    margin-left: -50vw;
    left: 50%;
    width: 100vw;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  `}
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const POST_ITEM_LAYOUT = {
  MOBILE_S: {
    imageType: POST_ITEM_IMAGE_TYPE.FULL_WIDTH_IMAGE,
    optionsFullWidthImage: { imageHeight: '180px', isColumnDirection: true },
  },
  MOBILE: {
    imageType: POST_ITEM_IMAGE_TYPE.FULL_WIDTH_IMAGE,
    optionsFullWidthImage: { imageHeight: '232px', isColumnDirection: true },
  },
  TABLET: {
    imageType: POST_ITEM_IMAGE_TYPE.DYNAMIC_SIZE_IMAGE,
    optionsDynamicSizeImage: { imageHeight: '342px', isColumnDirection: true },
  },
  DESKTOP: {
    imageType: POST_ITEM_IMAGE_TYPE.DYNAMIC_SIZE_IMAGE,
    optionsDynamicSizeImage: { imageHeight: '380px', isColumnDirection: true },
  },
}

const HomeTopFeaturedMainSection = ({ post }) => {
  const { isDesktop, isTablet } = useContext(DetectDeviceContext)
  if (isEmpty(post)) return null

  const isPromo = post.__typename === 'Promo'
  const postDataProps = isPromo
    ? generatePostDataPropsByPromo(post)
    : generatePostDataProps(post)

  return (
    <ScContainer className="HomeTopFeaturedMainSection">
      <ScGreenBgWrapper />
      <PostItemLayout
        {...postDataProps}
        // styling
        titleHtmlTag={'h2'}
        titleLines={{ mobileLines: 3, tabletLines: 3, desktopLines: 3 }}
        titleColor={COLORS.BLACK}
        displayCategoryTitleColor={
          isPromo
            ? isDesktop
              ? COLORS.GREY
              : COLORS.WHITE
            : COLORS.LT_SUN_YELLOW
        }
        displayCategoryMarginTop={
          isDesktop ? '46px' : isTablet ? '42px' : '39px'
        }
        externalLinkIconColor={isDesktop ? undefined : COLORS.BLACK}
        // layout
        imageResponsiveConfigs={POST_ITEM_LAYOUT}
        withBoxShadow
      />
    </ScContainer>
  )
}

HomeTopFeaturedMainSection.propTypes = {
  post: PropTypes.object.isRequired,
}

export default HomeTopFeaturedMainSection
