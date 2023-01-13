import isEmpty from "lodash/isEmpty"
import React, { useContext } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"

import FancyHeader from "../FancyHeader"
import GridList from "../GridList"
import PostSlider from "../PostSlider"
import PostItemLayout, { generatePostDataProps } from "../PostItemLayout"
import GetPostListQuery from "../graphql/GetPostListQuery"

import ICON_VIDEOSTORIES_UPPER from "../../statics/images/icon-videostories-upper.svg"
import ICON_VIDEOSTORIES_BOTTOM from "../../statics/images/icon-videostories-bottom.svg"

import { MEDIA, COLORS, withFullWidth } from "../../utils/styles"
import routes from "../../configs/routes"

const ScWrapper = styled.div`
  position: relative;
`
const ScFeaturedPost = styled.div`
  position: relative;
  padding-bottom: 3.75rem;
  ${MEDIA.MOBILE`padding-bottom: 2.5rem;`}

  ${MEDIA.DESKTOP`direction: rtl;`}
`
const ScContentBox = styled.div`
  position: relative;
  padding-bottom: 3.75rem;
`

const ScContainer = styled.div`
  margin-top: 1.88rem;
  ${MEDIA.MOBILE`margin-top: 1.25rem;`}
`

const ScBackgroundBoxDiv = styled.div`
  position: absolute;
  padding-top: 3.75rem;
  ${MEDIA.DESKTOP`padding-top: 18.19rem;`}
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
  opacity: 0.8;
  background: ${COLORS.YELLOW};
  ${withFullWidth}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const VideoStoryDesktop = ({ posts }) => {
  // get first element of posts
  const featuredPost = posts[0]
  const slicedPosts = posts.slice(1)
  return (
    <ScContentBox>
      <ScFeaturedPost>
        <PostItemLayout
          {...generatePostDataProps(featuredPost, false, false)}
          // styling
          titleHtmlTag={"h2"}
          titleLines={{ desktopLines: 4 }}
          showPlayButton={true}
          // layout handler
          withPlaybuttonSize={"4.69rem"}
          optionsDynamicSizeImage={{
            imageHeight: "351px",
            imageWidth: "623px",
          }}
          columnGap={"1.75rem"}
        />
      </ScFeaturedPost>

      <GridList column={3} columnGap={"1.75rem"}>
        {slicedPosts.map((post) => (
          <PostItemLayout
            key={`post-${post.slug}`}
            {...generatePostDataProps(post, false, false)}
            // styling
            titleHtmlTag={"h4"}
            titleLines={{ mobileLines: 3, tabletLines: 3, desktopLines: 3 }}
            // layout handler
            withPlaybuttonSize={"3.13rem"}
            optionsDynamicSizeImage={{
              imageHeight: "191px",
              imageWidth: "344px",
              isColumnDirection: true,
            }}
          />
        ))}
      </GridList>

      <ScBackgroundBoxDiv>
        <ScBackgroundBoxColor />
      </ScBackgroundBoxDiv>
    </ScContentBox>
  )
}

VideoStoryDesktop.propTypes = {
  posts: PropTypes.array,
}

VideoStoryDesktop.defaultProps = {
  posts: [],
}

const VideoStoryTabletMobile = ({ posts }) => {
  const { isMobile } = useContext(DetectDeviceContext)
  const slicedPosts = posts.slice(0, 3)
  return (
    <ScFeaturedPost>
      <PostSlider
        posts={slicedPosts}
        wrapAround={false}
        slidesToShow={1.25}
        slideWidth={isMobile ? 1.12 : "611px"}
        cellAlign="center"
        cellSpacing={isMobile ? 11.9 : 16}
        renderCenterLeftControls={null}
        renderCenterRightControls={null}
      />
      <ScBackgroundBoxDiv>
        <ScBackgroundBoxColor />
      </ScBackgroundBoxDiv>
    </ScFeaturedPost>
  )
}

VideoStoryTabletMobile.propTypes = {
  posts: PropTypes.array,
}

VideoStoryTabletMobile.defaultProps = {
  posts: [],
}

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const HomeVideoStories = () => {
  const { isDesktop } = useContext(DetectDeviceContext)
  const ComponentToRender = isDesktop
    ? VideoStoryDesktop
    : VideoStoryTabletMobile
  const queryString = "&fields.videoID[exists]=true"

  return (
    <GetPostListQuery limit={4} queryString={queryString}>
      {({ posts, isLoading, isError }) => {
        if (isLoading || isError || isEmpty(posts)) return null

        return (
          <ScWrapper>
            <FancyHeader
              title="VIDEO STORIES"
              titleUrl={routes.contentIndex.pathResolver("video")}
              iconImage={ICON_VIDEOSTORIES_UPPER}
              underlineImage={ICON_VIDEOSTORIES_BOTTOM}
            />

            <ScContainer>
              <ComponentToRender posts={posts} />
            </ScContainer>
          </ScWrapper>
        )
      }}
    </GetPostListQuery>
  )
}

export default HomeVideoStories
