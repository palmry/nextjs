import React from "react"
import styled, { css } from "styled-components"
import PropTypes from "prop-types"
import { COLORS } from "../utils/styles"
import Link from "wsc/components/Link"

const ScWrapper = styled.div`
  ${(props) => props.alignCenter && `text-align: center;`}
`
const titleTextStyle = css`
  ${(props) =>
    props.withUnderline && `border-bottom: 3px solid ${props.underlineColor};`}
  ${(props) =>
    props.withTextTransform && `text-transform: ${props.withTextTransform};`}
  ${(props) => props.withDisplayInline && `display: inline;`}
`
const ScTitleTextH1 = styled.h1`
  ${titleTextStyle}
`
const ScTitleTextH2 = styled.h2`
  ${titleTextStyle}
`
const ScTitleTextH3 = styled.h3`
  ${titleTextStyle}
`
const ScTitleTextH4 = styled.h4`
  ${titleTextStyle}
`
const ScTitleTextDiv = styled.div`
  ${titleTextStyle}
`

const ScTitleIcon = styled.img`
  ${(props) => props.width && `width: ${props.width};`}
  ${(props) => !props.withCenter && `margin-left: 0.4em;`}
  ${(props) => props.verticalAlign && `vertical-align: ${props.verticalAlign};`}
`
const ScUnderlineImage = styled.img`
  display: block;
  ${(props) =>
    props.underlineImageMargin && `margin: ${props.underlineImageMargin};`}
  ${(props) => props.isUnderlineImageCenterAlign && `margin: 0 auto;`}
`
const ScLink = styled(({ ...props }) => <Link {...props} />)`
  ${(props) => props.noneBorder && `border-bottom: none;`}
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const TitleComponents = {
  h1: ScTitleTextH1,
  h2: ScTitleTextH2,
  h3: ScTitleTextH3,
  h4: ScTitleTextH4,
}

const FancyHeader = ({
  title,
  titleHtmlTag,
  className,
  titleClassName,
  iconImage,
  iconWidth,
  iconVerticalAlign,
  underlineImage,
  underlineImageMargin,
  isUnderlineImageCenterAlign,
  withCenterLayout,
  withUnderline,
  underlineColor,
  withTextTransform,
  titleUrl,
}) => {
  // check title url
  const ScTitle = titleUrl ? (
    <ScLink to={titleUrl} noneBorder={true} withDefaultStyle={false}>
      {title}
    </ScLink>
  ) : (
    title
  )
  // switch component based on given props
  const ScTitleText = TitleComponents[titleHtmlTag] || ScTitleTextDiv
  const Title = (
    <ScTitleText
      withUnderline={withUnderline}
      underlineColor={underlineColor}
      className={titleClassName}
      withTextTransform={withTextTransform}
      withDisplayInline={!withCenterLayout}
    >
      {ScTitle}
    </ScTitleText>
  )

  const Icon = iconImage && (
    <ScTitleIcon
      src={iconImage}
      withCenter={withCenterLayout}
      width={iconWidth}
      verticalAlign={iconVerticalAlign}
    />
  )
  const UnderlineImage = underlineImage && (
    <ScUnderlineImage
      src={underlineImage}
      isUnderlineImageCenterAlign={isUnderlineImageCenterAlign}
      underlineImageMargin={underlineImageMargin}
    />
  )

  return withCenterLayout ? (
    // center : icon will display over the title
    <ScWrapper alignCenter className={className}>
      {Icon}
      {Title}
      {UnderlineImage}
    </ScWrapper>
  ) : (
    // same row : icon will display at the end of title
    <ScWrapper className={className}>
      {Title}
      {Icon}
      {UnderlineImage}
    </ScWrapper>
  )
}

FancyHeader.propTypes = {
  title: PropTypes.string.isRequired,
  titleHtmlTag: PropTypes.oneOf(["h1", "h2", "h3", "h4", "div"]),
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  iconImage: PropTypes.string,
  iconWidth: PropTypes.string,
  iconVerticalAlign: PropTypes.string,
  underlineImage: PropTypes.string,
  underlineImageMargin: PropTypes.string,
  isUnderlineImageCenterAlign: PropTypes.bool,
  withCenterLayout: PropTypes.bool,
  withUnderline: PropTypes.bool,
  underlineColor: PropTypes.string,
  withTextTransform: PropTypes.string,
  titleUrl: PropTypes.string,
}

FancyHeader.defaultProps = {
  className: "",
  titleHtmlTag: "div",
  titleClassName: "font-section-header-1",
  iconImage: null,
  iconWidth: null,
  iconVerticalAlign: "middle",
  underlineImage: null,
  underlineImageMargin: "0",
  isUnderlineImageCenterAlign: true,
  withCenterLayout: true,
  withUnderline: false,
  underlineColor: COLORS.LT_SUN_YELLOW,
  withTextTransform: "uppercase",
  titleUrl: null,
}

export default FancyHeader
