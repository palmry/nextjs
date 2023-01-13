import get from "lodash/get"
import isEmpty from "lodash/isEmpty"
import React, { useContext } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"
import FancyHeader from "../FancyHeader"
import GridList from "../GridList"
import PostItemLayout, {
  generatePostDataProps,
  generatePostDataPropsByPromo,
} from "../PostItemLayout"
import SeeMoreButton from "../button/SeeMoreButton"
import { MEDIA, POST_ITEM_IMAGE_TYPE, withFullWidth } from "../../utils/styles"
import { contentfulApiCurrentDateTime } from "wsc/utils/common"
import { COLOR_CONFIGS } from "../../configs/homeMidFeatured"
import MODULE_CONFIGS from "../../statics/configs/module.json"

const POST_ITEM_LAYOUT = {
  MOBILE: {
    imageType: POST_ITEM_IMAGE_TYPE.DYNAMIC_SIZE_IMAGE,
    optionsDynamicSizeImage: {
      imageHeight: "206px",
      isColumnDirection: true,
    },
  },
  TABLET: {
    imageType: POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE,
    optionsSquareImage: { imageSize: "296px", isColumnDirection: true },
  },
  DESKTOP: {
    imageType: POST_ITEM_IMAGE_TYPE.DYNAMIC_SIZE_IMAGE,
    optionsDynamicSizeImage: {
      imageHeight: "298.5px",
      isColumnDirection: true,
    },
  },
}

const ScWrapper = styled.div``
const ScFancyHeader = styled(FancyHeader)`
  text-align: center;
`
const ScContainer = styled.div`
  position: relative;
  margin-top: 30px;
  padding-bottom: 60px;
  ${MEDIA.MOBILE`
    margin-top: 20px;
    padding-bottom: 40px;
  `}
`
const ScFooter = styled.div`
  text-align: center;
  margin-top: 30px;
  ${MEDIA.DESKTOP`margin-top: 40px;`}
`
const ScBackgroundBoxDiv = styled.div`
  ${withFullWidth}
  background-color: ${(props) => props.background};
  position: absolute;
  height: calc(100% - 60px);
  top: 0;
  z-index: -1;
  margin-top: 60px;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const RenderHomeMidFeatured = (props) => {
  const { isDesktop, isTablet, isMobile } = useContext(DetectDeviceContext)
  const { title, destinationUrl, displayPosts, configs, isSponsoredContent } =
    props

  return (
    <ScWrapper>
      <ScFancyHeader
        title={title}
        titleUrl={destinationUrl}
        withCenterLayout={false}
        withUnderline={true}
        underlineColor={configs.underlineColor}
      />
      <ScContainer>
        <GridList
          column={isMobile ? 1 : 2}
          columnGap={isDesktop ? "28px" : "16px"}
          rowGap={isMobile ? "30px" : "0"}
        >
          {displayPosts.map((post, index) => {
            const isPromo = post.__typename === "Promo"
            const postDataProps = isPromo
              ? generatePostDataPropsByPromo(post, isSponsoredContent)
              : generatePostDataProps(post, false, true, isSponsoredContent)

            return (
              <article key={`HomeMidFeatured-${index}`}>
                <PostItemLayout
                  {...postDataProps}
                  // styling
                  titleColor={configs.titleColor}
                  titleHtmlTag={isTablet ? "h3" : "h2"}
                  titleLines={{
                    mobileLines: 3,
                    tabletLines: 3,
                    desktopLines: 3,
                  }}
                  displayCategoryTitleColor={configs.displayCategoryTitleColor}
                  externalLinkIconColor={configs.titleColor}
                  // layout
                  imageResponsiveConfigs={POST_ITEM_LAYOUT}
                  rowGap={isDesktop ? "2px" : "0"}
                />
              </article>
            )
          })}
        </GridList>
        {destinationUrl && (
          <ScFooter>
            <SeeMoreButton url={destinationUrl} />
          </ScFooter>
        )}
        <ScBackgroundBoxDiv background={configs.background} />
      </ScContainer>
    </ScWrapper>
  )
}

RenderHomeMidFeatured.propTypes = {
  title: PropTypes.string,
  destinationUrl: PropTypes.string,
  displayPosts: PropTypes.array,
  configs: PropTypes.object,
  isSponsoredContent: PropTypes.bool,
}
RenderHomeMidFeatured.defaultProps = {
  title: null,
  destinationUrl: null,
  displayPosts: [],
  configs: COLOR_CONFIGS["series"],
  isSponsoredContent: false,
}

const HomeMidFeatured = (props) => {
  const { moduleName, type, amountOfPosts } = props
  const CONFIGS = COLOR_CONFIGS[type]
  const midFeaturedModule = MODULE_CONFIGS[moduleName]

  if (isEmpty(midFeaturedModule)) return null

  const title = get(midFeaturedModule, "title")
  const destinationUrl = get(midFeaturedModule, "destinationUrl")
  const featuredPosts = get(midFeaturedModule, "featuredPostsCollection.items")
  const isSponsoredContent = get(midFeaturedModule, "isSponsoredContent")

  // filter out post that its publish date is set to future date
  const currentFeaturedPosts = featuredPosts.filter((post) => {
    const postPublishDate = Date.parse(post.publishDate)
    return postPublishDate <= Date.parse(contentfulApiCurrentDateTime())
  })
  // get maximum 2 posts to display
  const displayPosts = currentFeaturedPosts.slice(0, amountOfPosts)
  if (isEmpty(displayPosts)) return null

  return (
    <RenderHomeMidFeatured
      title={title}
      destinationUrl={destinationUrl}
      displayPosts={displayPosts}
      type={type}
      configs={CONFIGS}
      isSponsoredContent={isSponsoredContent}
    />
  )
}

HomeMidFeatured.propTypes = {
  moduleName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  amountOfPosts: PropTypes.number.isRequired,
}
HomeMidFeatured.defaultProps = {}

export default HomeMidFeatured
