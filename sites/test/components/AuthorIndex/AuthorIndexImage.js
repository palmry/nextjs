import React from "react"
import styled from "styled-components"
import { MEDIA, COLORS } from "../../utils/styles"
import PropTypes from "prop-types"
import ICON_AUTHOR_PLACEHOLDER from "../../statics/images/icon-author-placeholder.png"
import ResponsiveImage, {
  ResponsiveImageWithBoxShadow,
} from "../ResponsiveImage"
import Link from "wsc/components/Link"
import routes from "../../configs/routes"

const ScWrapper = styled.div`
  position: relative;
  height: 220px;
  width: 220px;
  margin-bottom: 24px;
  ${MEDIA.TABLET`
    margin-bottom: 32px;
    height: 180px;
    width: 180px;
  `}
  ${MEDIA.DESKTOP`margin-bottom: 31px;`}
`
const ScOverlay = styled.div`
  z-index: 3;
  border-radius: 50%;
  position: absolute;
  width: 100%;
  height: 100%;
  ${(props) =>
    props.isHovering &&
    `background-color: ${COLORS.LT_SUN_YELLOW};
    opacity: 0.3;
  `}
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AuthorIndexImage = ({
  src,
  slug,
  isHovering,
  onMouseOver,
  onMouseOut,
  withShadow,
  ...restProps
}) => {
  const AuthorImageBox = withShadow
    ? ResponsiveImageWithBoxShadow
    : ResponsiveImage
  return (
    <ScWrapper className="AuthorIndexImage">
      <Link to={routes.author.pathResolver(slug)} withDefaultStyle={false}>
        <ScOverlay
          isHovering={isHovering}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        />
        <AuthorImageBox
          activeLoad={true}
          src={src || ICON_AUTHOR_PLACEHOLDER}
          squareSize={"100%"}
          resourceSizeValues={[220, 440, 660]}
          resourceSizeRules={["1x", "2x", "3x"]}
          imgQuality={90}
          isCircle={true}
          isSqrFlex={true}
          withShadow={withShadow}
          {...restProps}
        />
      </Link>
    </ScWrapper>
  )
}
AuthorIndexImage.propTypes = {
  slug: PropTypes.string.isRequired,
  src: PropTypes.string,
  isHovering: PropTypes.bool.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  withShadow: PropTypes.bool,
}

AuthorIndexImage.defaultProps = {
  src: null,
  withShadow: false,
}

export default AuthorIndexImage
