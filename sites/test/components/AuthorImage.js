import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import ICON_AUTHOR_PLACEHOLDER from "../statics/images/icon-author-placeholder.png"
import { COLORS } from "../utils/styles"
import ResponsiveImage, {
  ResponsiveImageWithBoxShadow,
} from "./ResponsiveImage"

const ScWrapper = styled.div`
  position: relative;
  ${(props) => `
    height: ${props.size};
    width: ${props.size};
  `}
`
const ScOverlayImage = styled.div`
  position: absolute;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  border: 1px solid ${COLORS.YELLOW};
  z-index: 1;
  top: calc(var(--withImageBoxShadow_boxShadowLength) * -1);
  left: calc(var(--withImageBoxShadow_boxShadowLength) * -1);
`
const ScOverlay = styled.div`
  &:hover {
    background-color: ${COLORS.LT_SUN_YELLOW};
    opacity: 0.3;
  }
  z-index: 3;
  border-radius: 50%;
  position: absolute;
  width: 100%;
  height: 100%;
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AuthorImage = ({
  size,
  src,
  withFrame,
  isLink,
  withImageShadow,
  ...restProps
}) => {
  const AuthorImageBox = withImageShadow
    ? ResponsiveImageWithBoxShadow
    : ResponsiveImage
  return (
    <ScWrapper size={size} className="AuthorImage">
      {isLink && <ScOverlay />}
      {withFrame && <ScOverlayImage />}
      <AuthorImageBox
        src={src || ICON_AUTHOR_PLACEHOLDER}
        squareSize={`${size}`}
        imgQuality={90}
        isCircle={true}
        {...restProps}
      />
    </ScWrapper>
  )
}

AuthorImage.propTypes = {
  isLink: PropTypes.bool,
  size: PropTypes.string,
  src: PropTypes.string,
  withFrame: PropTypes.bool,
  withImageShadow: PropTypes.bool,
}

AuthorImage.defaultProps = {
  size: "100%",
  src: null,
  withFrame: false,
  isLink: false,
  withImageShadow: true,
}

export default AuthorImage
