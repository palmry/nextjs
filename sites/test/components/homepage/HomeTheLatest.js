import get from "lodash/get"
import isEmpty from "lodash/isEmpty"
import React, { useContext } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"
import FancyHeader from "../FancyHeader"
import PostItemLayout, { generatePostDataProps } from "../PostItemLayout"
import GetPostListQuery from "../graphql/GetPostListQuery"
import { MEDIA, POST_ITEM_IMAGE_TYPE, COLORS } from "../../utils/styles"
import SeeMoreButton from "../button/SeeMoreButton"
import routes from "../../configs/routes"
import { contentfulApiCurrentDateTime } from "wsc/utils/common"
import MODULE_CONFIGS from "../../statics/configs/module.json"

const ScWrapper = styled.div`
  position: relative;
`
const ScFancyHeader = styled(FancyHeader)`
  text-align: center;
`
const ScContainer = styled.div`
  margin-top: 30px;
  ${MEDIA.MOBILE`margin-top: 20px;`}
`
const ScArticle = styled.article`
  // check if it's not last section and its children is not empty
  &:not(:last-child):not(:empty) {
    margin-bottom: 30px;
    ${MEDIA.DESKTOP`margin-bottom: 40px;`}
  }
`
const ScChildren = styled.div`
  // check if children is not empty
  &:not(:empty) {
    margin: 40px 0;
    ${MEDIA.TABLET`margin: 60px 0;`}
    ${MEDIA.DESKTOP`margin: 70px 0;`}
  }
`
const ScFooter = styled.div`
  text-align: center;
  margin-top: 30px;
  ${MEDIA.DESKTOP` margin-top: 40px;`}
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/
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
  },
  DESKTOP: {
    optionsDynamicSizeImage: { imageWidth: "530px", imageHeight: "298px" },
  },
}

const HomeTheLatest = (props) => {
  const queryString = "&fields.hideOnHomepage[ne]=true"
  const { isDesktop } = useContext(DetectDeviceContext)
  const destinationUrl = routes.contentIndex.pathResolver("latest")
  const CHILDREN = React.Children.toArray(props.children)
  const NUM = props.injectModuleAfterNumPosts
  const HOMEPAGE_MODULE = props.moduleConfig

  // Get Featured Posts from all homepage module
  let excludedPostSlugs = []
  HOMEPAGE_MODULE.forEach((module) => {
    const moduleConfig = MODULE_CONFIGS[module.name]
    if (isEmpty(moduleConfig)) return null
    const featuredPosts = get(moduleConfig, "featuredPostsCollection.items")

    let featuredPostsSlug = []
    // filter out post that its publish date is set to future date
    // and get slug of displayed featured posts only
    featuredPosts.forEach((post) => {
      const postPublishDate = Date.parse(post.publishDate)
      if (
        postPublishDate <= Date.parse(contentfulApiCurrentDateTime()) &&
        featuredPostsSlug.length < module.amountOfPosts
      ) {
        featuredPostsSlug.push(post.slug)
      }
    })
    excludedPostSlugs.push(...featuredPostsSlug)
  })

  return (
    <GetPostListQuery
      limit={8}
      queryString={queryString}
      excludedPostSlugs={excludedPostSlugs}
    >
      {({ posts, isLoading, isError }) => {
        if (isLoading || isError || isEmpty(posts)) return null

        return (
          <ScWrapper>
            <ScFancyHeader
              title="THE LATEST"
              titleUrl={destinationUrl}
              withCenterLayout={false}
              withUnderline={true}
              underlineColor={COLORS.LT_DARK_PEACH}
            />
            <ScContainer>
              {posts.map((post, index) => (
                <React.Fragment key={post.slug}>
                  <ScArticle>
                    <PostItemLayout
                      {...generatePostDataProps(post)}
                      // layout
                      titleHtmlTag="h2"
                      titleLines={{
                        mobileLines: 3,
                        tabletLines: 4,
                        desktopLines: 3,
                      }}
                      imageResponsiveConfigs={POST_ITEM_LAYOUT}
                      columnGap={isDesktop ? "28px" : "16px"}
                    />
                  </ScArticle>
                  {index % NUM === NUM - 1 && CHILDREN.length > index / NUM && (
                    <ScChildren>{CHILDREN[parseInt(index / NUM)]}</ScChildren>
                  )}
                </React.Fragment>
              ))}

              <ScFooter>
                <SeeMoreButton url={destinationUrl} isOutlined />
              </ScFooter>
            </ScContainer>
          </ScWrapper>
        )
      }}
    </GetPostListQuery>
  )
}

HomeTheLatest.propTypes = {
  children: PropTypes.node,
  injectModuleAfterNumPosts: PropTypes.number,
  moduleConfig: PropTypes.array.isRequired,
}
HomeTheLatest.defaultProps = {
  children: null,
  injectModuleAfterNumPosts: 2,
}
export default HomeTheLatest
