import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import GridList from '../GridList'
import PostItemLayout, {
  generatePostDataProps,
  generatePostDataPropsByPromo,
} from '../PostItemLayout'
import FancyHeader from '../FancyHeader'
import { MEDIA, POST_ITEM_IMAGE_TYPE, COLORS } from '../../utils/styles'
import SeeMoreButton from '../button/SeeMoreButton'

const ScWrapper = styled.div``
const ScContainer = styled.div`
  margin-top: 1.3125rem;
  ${MEDIA.TABLET`margin-top: 1.9375rem;`}
  ${MEDIA.DESKTOP`margin-top: 1.75rem;`}
`
const ScFooter = styled.div`
  text-align: center;
  margin-top: 38px;
`
// we didn't use text decoration underline because we want underline thickness to be 2px
// but option to set text decoration thickness is support only a few browser.
// i.e. text decoration thickness is vary by font-size for major browser.
// so, when font-size is small --> text decoration is too small for us.
// see: https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-thickness
const ScFancyHeader = styled(FancyHeader)`
  // text-decoration: underline solid red;
  text-align: center;
  ${MEDIA.DESKTOP`text-align: left;`}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const HomeTopFeaturedSubSection = ({ posts, title, destinationUrl }) => {
  const { isDesktop, isTablet } = useContext(DetectDeviceContext)
  const imageSize = isDesktop ? '8.25rem' : null

  if (isEmpty(posts)) return null

  return (
    <ScWrapper className="HomeTopFeaturedSubSection">
      <ScFancyHeader
        title={title}
        titleUrl={destinationUrl}
        withCenterLayout={false}
        withUnderline={true}
        underlineColor={COLORS.LT_DARK_GREY_BLUE}
        titleClassName={'font-body'}
      />
      <ScContainer>
        <GridList
          column={1}
          rowGap={isDesktop ? '15px' : isTablet ? '38px' : '35px'}
        >
          {posts.map((post, index) => {
            const isPromo = post.__typename === 'Promo'
            const postDataProps = isPromo
              ? generatePostDataPropsByPromo(post)
              : generatePostDataProps(post)
            return (
              <PostItemLayout
                key={`HomeTopFeaturedSubSection-${index}`}
                {...postDataProps}
                // styling
                titleHtmlTag={isTablet ? 'h2' : 'h4ParentingTitle'}
                titleLines={{ mobileLines: 3, tabletLines: 4, desktopLines: 3 }}
                withSeparator={isDesktop && index < posts.length - 1}
                displayCategoryTitleColor={isPromo ? COLORS.GREY : undefined}
                // layout handler
                imageType={POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE}
                optionsSquareImage={{ imageSize }}
                columnGap={isDesktop ? '26px' : isTablet ? '16px' : '23px'}
                withBoxShadow
              />
            )
          })}
        </GridList>

        {destinationUrl && (
          <ScFooter>
            <SeeMoreButton url={destinationUrl} isOutlined />
          </ScFooter>
        )}
      </ScContainer>
    </ScWrapper>
  )
}

HomeTopFeaturedSubSection.propTypes = {
  posts: PropTypes.array.isRequired,
  title: PropTypes.string,
  destinationUrl: PropTypes.string,
}

HomeTopFeaturedSubSection.defaultProps = {
  title: 'Featured',
  destinationUrl: null,
}

export default HomeTopFeaturedSubSection
