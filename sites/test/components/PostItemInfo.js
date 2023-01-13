import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import routes from '../configs/routes'
import Link from 'wsc/components/Link'
import LinkHeading from './LinkHeading'
import { COLORS, withLineClamp, MEDIA, FONT_FAMILIES } from '../utils/styles'
import { useTranslator } from '../hooks/useTranslator'
import { ReactComponent as ICON_EXTERNAL_LINK } from 'wsc/statics/images/icon-external-link.svg'

const ScWrapper = styled.div`
  direction: ltr;
  font-size: 0.69rem;
`
const ScCategoryTitle = styled.div.attrs({
  className: 'font-description',
})`
  text-transform: uppercase;
  ${props => props.isBold && `font-weight: bold;`}
  margin-bottom: 10px;
  letter-spacing: 0.72px;
  color: ${props => props.color};
  ${MEDIA.DESKTOP`letter-spacing: 0.66px;`}
`
const ScDateTitle = styled.div.attrs({ className: 'font-description' })`
  font-style: italic;
  margin-top: 0.63rem;
  color: ${COLORS.GREY};
`
const titleStyle = css`
  font-family: ${FONT_FAMILIES.ASAP};
  color: ${props => props.color};

  & a > div:first-child {
    ${props => props.titleLines && withLineClamp({ ...props.titleLines })}
  }
`
const ScTitleH1 = styled.h1`
  ${titleStyle}
`
const ScTitleH2 = styled.h2`
  ${titleStyle}
`
const ScTitleH3 = styled.h3`
  ${titleStyle}
`
const ScTitleH4 = styled.h4`
  ${titleStyle}
`
const ScParentingTitle = styled.h4.attrs({
  className: 'h4-parenting-title',
})`
  ${titleStyle}
`
const ScSuggestedTitle = styled.div.attrs({
  className: 'suggested-title',
})`
  ${titleStyle}
`
const ScExternalLinkIcon = styled(ICON_EXTERNAL_LINK)`
  width: 20px;
  height: 20px;
  margin-top: 10px;
  display: block;
  ${props => props.color && `fill: ${props.color};`}
  ${MEDIA.TABLET`width: 17px; height: 17px;`}
  ${MEDIA.MOBILE`width: 13px; height: 13px;`}
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const TitleComponents = {
  h1: ScTitleH1,
  h2: ScTitleH2,
  h3: ScTitleH3,
  h4: ScTitleH4,
  h4ParentingTitle: ScParentingTitle,
  suggestedTitle: ScSuggestedTitle,
}

const PostItemInfo = props => {
  const {
    titleHtmlTag,
    titleColor,
    titleLines,
    displayCategoryTitle,
    displayCategorySlug,
    isDisplayCategoryTitleBold,
    displayCategoryTitleColor,
    externalLinkIconColor,
    updatedDate,
    publishDate,
    title,
    isHoveringHeading,
    onMouseOverHeading,
    onMouseOutHeading,
    onClick,
    categorySlug,
    slug,
    destinationUrl,
  } = props
  const { getPostDateTitle } = useTranslator()
  let updatedAtTitle
  // switch component based on given props.titleHtmlTag
  const TitleComponent = TitleComponents[titleHtmlTag]
  // format date
  if (publishDate || updatedDate) {
    updatedAtTitle = getPostDateTitle(publishDate, updatedDate)
  }

  // This is specs for rendering promo post.
  const categoryUrl = destinationUrl
    ? displayCategoryTitle !== 'PROMOTED'
      ? destinationUrl
      : null
    : displayCategorySlug
    ? routes.category.pathResolver(displayCategorySlug)
    : null

  const postUrl = destinationUrl || routes.post.pathResolver(categorySlug, slug)

  const CategoryComponent = ({ children }) => {
    if (categoryUrl) {
      return (
        <Link withDefaultStyle={false} to={categoryUrl} onClick={onClick}>
          {children}
        </Link>
      )
    } else {
      return <React.Fragment>{children}</React.Fragment>
    }
  }

  return (
    <ScWrapper>
      {displayCategoryTitle && (
        <CategoryComponent>
          <ScCategoryTitle isBold={isDisplayCategoryTitleBold} color={displayCategoryTitleColor}>
            {displayCategoryTitle}
          </ScCategoryTitle>
        </CategoryComponent>
      )}

      <TitleComponent color={titleColor} titleLines={titleLines} onClick={onClick}>
        <LinkHeading
          to={postUrl}
          isHovering={isHoveringHeading}
          onMouseOver={onMouseOverHeading}
          onMouseOut={onMouseOutHeading}
        >
          <div>{title}</div>
          {destinationUrl && <ScExternalLinkIcon color={externalLinkIconColor} />}
        </LinkHeading>
      </TitleComponent>

      {updatedAtTitle && <ScDateTitle>{updatedAtTitle}</ScDateTitle>}
    </ScWrapper>
  )
}

PostItemInfo.propTypes = {
  titleHtmlTag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h4ParentingTitle', 'suggestedTitle']),
  titleLines: PropTypes.shape({
    mobileLines: PropTypes.number,
    tabletLines: PropTypes.number,
    desktopLines: PropTypes.number,
  }),
  title: PropTypes.string.isRequired,
  titleColor: PropTypes.string,

  categorySlug: PropTypes.string,
  slug: PropTypes.string,
  displayCategoryTitle: PropTypes.string,
  displayCategorySlug: PropTypes.string,
  displayCategoryTitleColor: PropTypes.string,
  isDisplayCategoryTitleBold: PropTypes.bool,
  externalLinkIconColor: PropTypes.string,

  updatedDate: PropTypes.string,
  publishDate: PropTypes.string,

  isHoveringHeading: PropTypes.bool.isRequired,
  onMouseOverHeading: PropTypes.func.isRequired,
  onMouseOutHeading: PropTypes.func.isRequired,
  onClick: PropTypes.func,

  destinationUrl: PropTypes.string,
}

PostItemInfo.defaultProps = {
  titleHtmlTag: 'h2',
  titleLines: null,
  titleColor: COLORS.BLACK,

  categorySlug: '',
  slug: '',
  displayCategoryTitle: '',
  displayCategorySlug: '',
  displayCategoryTitleColor: COLORS.LT_DARK_PEACH,
  isDisplayCategoryTitleBold: true,
  externalLinkIconColor: COLORS.LT_DARK_PEACH,

  updatedDate: null,
  publishDate: null,

  onClick: () => {},

  destinationUrl: null,
}

export default PostItemInfo
