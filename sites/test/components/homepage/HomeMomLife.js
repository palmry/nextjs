import isEmpty from "lodash/isEmpty"
import get from "lodash/get"
import React, { useContext } from "react"
import styled from "styled-components"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"
import PropTypes from "prop-types"

import FancyHeader from "../FancyHeader"
import SeeMoreButton from "../button/SeeMoreButton"
import GridList from "../GridList"
import PostItemLayout, { generatePostDataProps } from "../PostItemLayout"
import GetPostListQuery, {
  getMainCategoryQueryString,
} from "../graphql/GetPostListQuery"
import { ModuleQuery } from "../graphql/ModuleQuery"

import ICON_MOMLIFE_UPPER from "../../statics/images/icon-momlife-upper.svg"
import ICON_MOMLIFE_BOTTOM from "../../statics/images/icon-momlife-bottom.svg"

import {
  MEDIA,
  COLORS,
  POST_ITEM_IMAGE_TYPE,
  withFullWidth,
} from "../../utils/styles"

const ScWrapper = styled.div`
  position: relative;
  padding-bottom: 3.75rem;
  ${MEDIA.MOBILE`padding-bottom: 2.50rem;`}
`

const ScBackgroundBoxDiv = styled.div`
  position: absolute;
  ${MEDIA.MOBILE`padding-top: 32rem;`}
  ${MEDIA.TABLET`padding-top: 11.88rem;`}
  ${MEDIA.DESKTOP`padding-top: 26.38rem;`}
  height: 100%;
  width: 100%;
  top: 0;
  z-index: -1;
`

const ScBackgroundBoxColor = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  bottom: 0;
  background: ${COLORS.BUBBLEGUM};
  ${withFullWidth}
`

const ScFeaturedPost = styled.div`
  margin-bottom: 1.88rem;
  ${MEDIA.TABLET`margin-bottom: 2.50rem;`}
  ${MEDIA.DESKTOP`margin-bottom: 3.75rem;`}
`
const ScContainer = styled.div`
  margin-top: 1.88rem;
  ${MEDIA.MOBILE`margin-top: 1.25rem;`}
`
const ScFooter = styled.div`
  text-align: center;
  margin-top: 3.75rem;
  ${MEDIA.MOBILE`margin-top: 2.50rem;`}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const FEATURED_POST_ITEM_LAYOUT = {
  MOBILE: {
    imageType: POST_ITEM_IMAGE_TYPE.FULL_WIDTH_IMAGE,
    optionsFullWidthImage: { imageHeight: "414px", isColumnDirection: true },
  },
  TABLET: {
    imageType: POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE,
    optionsSquareImage: { imageSize: "608px", isColumnDirection: true },
  },
}

const POST_ITEM_LAYOUT = {
  MOBILE: {
    optionsDynamicSizeImage: { imageHeight: "208px", isColumnDirection: true },
  },
  TABLET: {
    optionsDynamicSizeImage: { imageHeight: "342px", isColumnDirection: true },
  },
  DESKTOP: {
    imageType: POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE,
    optionsSquareImage: {
      isColumnDirection: true,
    },
  },
}

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const HomeMomLife = (props) => {
  const { isDesktop } = useContext(DetectDeviceContext)

  return (
    <ModuleQuery postLimit={6} moduleName={"HomeMomLife"}>
      {({ queryResponse }) => {
        const { state, moduleCollection } = queryResponse
        const title = get(moduleCollection, "items[0].title")
        const destinationUrl = get(moduleCollection, "items[0].destinationUrl")
        const posts = get(
          moduleCollection,
          "items[0].featuredPostsCollection.items"
        )
        if (state.isLoading || state.isError || isEmpty(posts)) return null
        return (
          <GetPostListQuery
            initialPosts={posts}
            limit={6}
            queryString={getMainCategoryQueryString(props.mainCategory)}
          >
            {({ posts, isLoading, isError }) => {
              if (isLoading || isError || isEmpty(posts)) return null

              // get first element of posts
              const featuredPost = posts[0]
              const gridPosts = !isDesktop ? posts.slice(1, 3) : posts

              return (
                <ScWrapper>
                  <FancyHeader
                    title={title}
                    titleUrl={destinationUrl}
                    iconImage={ICON_MOMLIFE_UPPER}
                    underlineImage={ICON_MOMLIFE_BOTTOM}
                  />
                  <ScContainer>
                    {!isDesktop && (
                      <ScFeaturedPost>
                        <PostItemLayout
                          {...generatePostDataProps(featuredPost)}
                          // styling
                          titleHtmlTag={"h3"}
                          titleLines={{
                            mobileLines: 2,
                            tabletLines: 2,
                            desktopLines: 3,
                          }}
                          displayCategoryTitleColor={COLORS.WHITE}
                          // layout
                          imageResponsiveConfigs={FEATURED_POST_ITEM_LAYOUT}
                        />
                      </ScFeaturedPost>
                    )}
                    <GridList column={isDesktop ? 3 : 1} columnGap={"1.75rem"}>
                      {gridPosts.map((post) => (
                        <PostItemLayout
                          key={`post-${post.slug}`}
                          {...generatePostDataProps(post)}
                          // styling
                          titleHtmlTag={"h3"}
                          titleLines={{
                            mobileLines: 2,
                            tabletLines: 2,
                            desktopLines: 3,
                          }}
                          displayCategoryTitleColor={COLORS.WHITE}
                          // layout
                          imageResponsiveConfigs={POST_ITEM_LAYOUT}
                        />
                      ))}
                    </GridList>
                    {destinationUrl && (
                      <ScFooter>
                        <SeeMoreButton url={destinationUrl} />
                      </ScFooter>
                    )}
                  </ScContainer>
                  <ScBackgroundBoxDiv>
                    <ScBackgroundBoxColor />
                  </ScBackgroundBoxDiv>
                </ScWrapper>
              )
            }}
          </GetPostListQuery>
        )
      }}
    </ModuleQuery>
  )
}

HomeMomLife.propTypes = {
  mainCategory: PropTypes.string.isRequired,
}

HomeMomLife.defaultProps = {}

export default HomeMomLife
