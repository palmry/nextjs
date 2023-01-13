import React, { useContext, useEffect } from "react"
import PropTypes from "prop-types"
import VisibilitySensor from "react-visibility-sensor"
import styled, { css } from "styled-components"

import Link from "wsc/components/Link"
import { MEDIA, COLORS, withFullWidth, PAGE_WIDTHS } from "wsc/utils/styles"
import {
  PostNavContext,
  getPreviousPost,
  getNextPost,
  getPostItems,
  getCurrentIndex,
} from "wsc/components/context/PostNavProvider"
import { ScCircleArrowRight, ScCircleArrowLeft } from "../styled/ScCircleArrow"
import { getActivePost } from "../../utils/activePost"

const ScPostNavBar = styled.nav`
  background-color: var(
    --withImageBoxShadow_boxShadowColor,
    ${COLORS.LIGHT_BLUE}
  );
  ${withFullWidth}
  position: ${(props) => (props.inAppBar ? "absolute" : "relative")};
  height: 60px;
  ${MEDIA.MOBILE`height:44px;`}
  bottom: ${(props) => (props.inAppBar ? "-60px" : "auto")};
  ${MEDIA.MOBILE`bottom: ${(props) => (props.inAppBar ? "-44px" : "auto")}`};
  margin-top: ${(props) => (props.inAppBar ? "0" : "20px")};
  box-sizing: border-box;
  transform: translateZ(0);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 23px;
  ${MEDIA.TABLET`padding: 0 80px`}
  > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${MEDIA.DESKTOP`max-width: ${PAGE_WIDTHS.DESKTOP}px;`}
    ${MEDIA.TABLET`max-width: ${PAGE_WIDTHS.TABLET}px;`}
  }
`
const ScLink = styled((props) => <Link {...props} />)`
  color: ${COLORS.WHITE};
  font-size: 0.75rem;
  display: flex;
  height: 100%;
  align-items: center;
  &:hover,
  &:active {
    svg {
      background-color: ${COLORS.rgba(COLORS.WHITE, "0.6")};
    }
  }
  svg {
    ${(props) => {
      return props.direction === "right"
        ? css`
            margin-left: 12px;
          `
        : css`
            margin-right: 12px;
          `
    }};
  }
`

export const PostNavBarVisAware = (props) => {
  const { post } = props
  const { currentPost, setCurrentPost, postNavBarOffset, setPostBarVisible } =
    useContext(PostNavContext)

  useEffect(() => {
    const activePost = getActivePost()
    if (activePost) setCurrentPost(activePost)
    return () => {
      setCurrentPost(null)
    }
  })

  return (
    currentPost && (
      <VisibilitySensor
        partialVisibility={false}
        onChange={(isVisible) => {
          setPostBarVisible(isVisible, post.sys.id)
        }}
        intervalCheck={true}
        intervalDelay={50}
        scrollCheck={true}
        scrollThrottle={20}
        offset={{ top: postNavBarOffset }}
      >
        <div>
          <PostNavBar {...props} />
        </div>
      </VisibilitySensor>
    )
  )
}

export const PostNavBar = (props) => {
  const { inAppBar, post } = props
  let { nextPost, previousPost, isDisabled } = useContext(PostNavContext)

  // This will fix the case that user scrolls down to the next post.
  // But the nav links is still rendered with previous post data.
  if (!inAppBar && post) {
    const postItems = getPostItems(post)
    const currentIndex = getCurrentIndex(post, postItems)
    previousPost = getPreviousPost(currentIndex, postItems)
    nextPost = getNextPost(currentIndex, postItems)
  }

  return (
    !isDisabled && (
      <ScPostNavBar inAppBar={inAppBar}>
        <div>
          <ScLink
            to={previousPost.path}
            withDefaultStyle={false}
            direction="left"
          >
            <ScCircleArrowLeft /> {previousPost.title}
          </ScLink>
          <ScLink to={nextPost.path} withDefaultStyle={false} direction="right">
            {nextPost.title} <ScCircleArrowRight />
          </ScLink>
        </div>
      </ScPostNavBar>
    )
  )
}

PostNavBar.propTypes = {
  inAppBar: PropTypes.bool,
  post: PropTypes.object,
}

PostNavBar.defaultProps = {
  inAppBar: false,
  post: null,
}

export default PostNavBar
