import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import marked from 'marked'
import { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import { markedLink } from 'wsc/utils/redirect'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { useTranslator } from '../hooks/useTranslator'

import AuthorImage from './AuthorImage'
import AuthorSocialLinks, { hasSocialLink } from './author/AuthorSocialLinks'
import FancyHeader from './FancyHeader'
import Link from 'wsc/components/Link'
import routes from '../configs/routes'
import { MEDIA, COLORS, FONT_FAMILIES } from '../utils/styles'
import right from '../statics/images/icon-nav-left.svg'

const ScFlexWrapper = styled.div.attrs({
  className: 'font-small-body',
})`
  display: flex;
  flex-direction: row;
  ${(props) =>
    props.withCenterLayout &&
    `
    flex-direction: column;
    align-items: center;
    text-align: center;`}
`

const ScContentWrapper = styled.div`
  ${(props) =>
    props.withCenterLayout
      ? `
      margin-top: 25px;
      align-items: center;`
      : `
      margin-left: ${props.columnGap};
    `}
`
const ScAuthorTitle = styled.div`
  font-family: ${FONT_FAMILIES.ASAP};
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: left;
  ${MEDIA.DESKTOP` font-size: 1.25rem;`}
  ${MEDIA.TABLET` font-size: 1.19rem;`}
  ${MEDIA.MOBILE`
    font-size: 1.13rem;
    text-align: center;
  `}
`
const ScContentItem = styled.div`
  ${defaultLinkStyleToUseInMD}
  ${MEDIA.TABLET` font-size: 0.94rem;`}
  
  &:not(:first-child) {
    margin-top: 20px;
  }

  p:not(:last-child) {
    margin-bottom: 15px;
  }
`
const renderer = new marked.Renderer()
renderer.link = markedLink

const ScLinkFlex = styled.div`
  ${(props) => props.displayType && `display: ${props.displayType};`}
  justify-content: space-between;
  flex-wrap: wrap;

  ${MEDIA.MOBILE`
  flex-direction: column;
  justify-content: center;
  align-content: center;`}
`

const ScLinkSetBox = styled.div`
  ${(props) => props.marginTop && `margin-top: ${props.marginTop};`}
`

const ScLink = styled((props) => <Link {...props} />).attrs({
  className: 'font-description',
})`
  &:hover {
    border-bottom: var(
      --author-info-link-border-bottom-hover,
      0.125rem solid ${COLORS.YELLOW}
    );
  }

  letter-spacing: 0.63px;
  font-size: 0.75rem;

  ${MEDIA.DESKTOP`
    font-size: 0.69rem;
    letter-spacing: 0.73px
  `}
`

const IconNext = styled(right)`
  fill: ${COLORS.BLACK};
  width: 4.5px;
  height: 8.4px;
  margin-left: 6px;
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AuthorInfo = ({
  authors,
  imageSize,
  withCenterLayout,
  columnGap,
  ...restProps
}) => {
  const author = authors[0]
  const { authorTitle, name, content } = author
  const imageUrl = author.image ? author.image.url : null
  const { isDesktop, isTablet, isMobile } = useContext(DetectDeviceContext)
  const { translator } = useTranslator()

  const containContent = !isEmpty(author.content)
  const containSocial = hasSocialLink(author)
  const autherIndexDisplayType = containContent ? 'flex' : 'block'
  let autherIndexLinkMarginTop = '52px'
  if (isMobile) {
    autherIndexLinkMarginTop = containSocial ? '12px' : '22px'
  } else {
    if (!containContent) {
      autherIndexLinkMarginTop = containSocial ? '5px' : '20px'
    }
  }
  return (
    <ScFlexWrapper withCenterLayout={withCenterLayout}>
      {/* image section */}
      <AuthorImage
        src={imageUrl}
        size={imageSize}
        resourceSizeValues={[150, 300, 450]}
        resourceSizeRules={['1x', '2x', '3x']}
        {...restProps}
        withImageShadow={true}
      />
      {/* content section */}
      <ScContentWrapper
        withCenterLayout={withCenterLayout}
        columnGap={columnGap}
      >
        <FancyHeader
          title={name}
          iconVerticalAlign='baseline'
          withCenterLayout={false}
          titleHtmlTag='h1'
          titleClassName=''
          withTextTransform='none'
          iconWidth={isDesktop ? '2.0625em' : isTablet ? '1.625em' : '1.375em'}
        />
        {authorTitle && <ScAuthorTitle>{authorTitle}</ScAuthorTitle>}
        {!isEmpty(content) && (
          <ScContentItem>
            <div
              dangerouslySetInnerHTML={{
                __html: marked(content, { renderer }),
              }}
            />
          </ScContentItem>
        )}
        <ScLinkFlex displayType={autherIndexDisplayType}>
          <div>
            <AuthorSocialLinks author={author} />
          </div>
          {/* view all contributors */}
          <ScLinkSetBox marginTop={autherIndexLinkMarginTop}>
            <ScLink to={routes.authorIndex.path} withDefaultStyle={false}>
              {translator('author.viewAllContributors')}
            </ScLink>
            <IconNext />
          </ScLinkSetBox>
        </ScLinkFlex>
      </ScContentWrapper>
    </ScFlexWrapper>
  )
}

AuthorInfo.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })
  ),
  imageSize: PropTypes.string,
  withCenterLayout: PropTypes.bool,
  columnGap: PropTypes.string,
}

AuthorInfo.defaultProps = {
  authors: [],
  imageSize: '100px',
  withCenterLayout: false,
  columnGap: '',
}

export default AuthorInfo
