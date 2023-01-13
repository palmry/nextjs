import React from "react"
import Link from "wsc/components/Link"
import marked from "marked"
import { markedLink } from "wsc/utils/redirect"
import PropTypes from "prop-types"
import styled from "styled-components"
import { ReactComponent as Right } from "../../statics/images/icon-nav-left.svg"
import { withLineClamp, COLORS, MEDIA, FONT_FAMILIES } from "../../utils/styles"

const contextline = {
  mobileLines: 2,
  tabletLines: 2,
  desktopLines: 2,
}
const ScWrapper = styled.div`
  margin-top: 16px;
`
const ContentText = styled.div`
  font-family: ${FONT_FAMILIES.ASAP};
  font-weight: bold;
  margin-bottom: 16px;
  ${MEDIA.MOBILE`
    max-width: 368px;
    font-size: 1.13rem
    margin-bottom: 10px;
    line-height: 21px;
  `}
  ${MEDIA.TABLET`
    width: 296px;
    font-size: 1.19rem;
    line-height: 22px;
  `}
  ${MEDIA.DESKTOP`
    width: 344px;
    font-size: 1.25rem;
    line-height: 23px;
  `}
  ${withLineClamp(contextline)}
`
const RegRight = styled(({ isHovering, ...props }) => <Right {...props} />)`
  fill: ${COLORS.BLACK}
  width: 4.5px;
  height: 8.4px;
  margin-left: 4.9px;
`
const Toggle = styled(({ isHovering, ...props }) => <Link {...props} />)`
  line-height: 16px;
  font-size: 0.7rem;
  letter-spacing: 0.04rem;
  ${MEDIA.TABLET`
    font-size: 0.76rem;
    letter-spacing: 0.045rem;
    line-height: 17px;
  `}
  ${MEDIA.MOBILE`
    font-size: 0.79rem;
    letter-spacing: 0.047rem;
    line-height: 17px;
  `}
  ${(props) =>
    props.isHovering &&
    `border-bottom: 0.125rem solid ${COLORS.LT_SUN_YELLOW};
  `}
  &:active {
    border-bottom: 0.125rem solid ${COLORS.LT_SUN_YELLOW};
  }
`

const renderer = new marked.Renderer()
renderer.link = markedLink

const AuthorIndexContent = ({
  to,
  authorTitle,
  isHovering,
  onMouseOver,
  onMouseOut,
}) => {
  return (
    <ScWrapper>
      {authorTitle ? <ContentText>{authorTitle}</ContentText> : ""}
      <Toggle
        withDefaultStyle={false}
        to={to}
        isHovering={isHovering}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        SEE MORE
      </Toggle>
      <RegRight isHovering={isHovering} />
    </ScWrapper>
  )
}

AuthorIndexContent.propTypes = {
  authorTitle: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isHovering: PropTypes.bool.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
}

export default AuthorIndexContent
