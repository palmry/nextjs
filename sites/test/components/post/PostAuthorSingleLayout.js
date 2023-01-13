import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import marked from 'marked'
import routes from '../../configs/routes'
import Link, { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import { markedLink } from 'wsc/utils/redirect'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import PostAuthorContent from './PostAuthorContent'
import { MEDIA } from '../../utils/styles'

import AuthorImage from '../AuthorImage'

const ScFlexWrapper = styled.div.attrs({
  className: 'font-small-body',
})`
  ${MEDIA.TABLET`padding-bottom: 27px;`}
  display: flex;
  flex-direction: row;
  ${props =>
    props.withCenterLayout &&
    `
    flex-direction: column;
    align-items: center;
    text-align: center;`}
  ${props => props.width && `width: ${props.width}`}
`

const ScContentWrapper = styled.div`
  ${props =>
    props.withCenterLayout
      ? `
      margin-top: 10px;
      align-items: center;`
      : `
      margin-left: ${props.columnGap};
    `}
`

const ScContentItem = styled.div`
  ${defaultLinkStyleToUseInMD}

  &:first-child {
    margin-bottom: 20px;
  }
`

const renderer = new marked.Renderer()
renderer.link = markedLink

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const PostAuthorSingleLayout = ({ authors, imageSize, columnGap, ...restProps }) => {
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)
  if (!authors.length) return null
  const author = authors[0]
  const { name, content, slug } = author
  const imageUrl = author.image ? author.image.url : null
  const withCenterLayout = isMobile

  return (
    <ScFlexWrapper withCenterLayout={withCenterLayout} width={isDesktop ? '725px' : null}>
      {/* image section */}
      <AuthorImage
        src={imageUrl}
        size={isDesktop ? '80px' : '40px'}
        withFrame={isDesktop}
        {...restProps}
      />
      {/* content section */}
      <ScContentWrapper withCenterLayout={withCenterLayout} columnGap={isMobile ? '33px' : '38px'}>
        <ScContentItem>
          <Link to={routes.author.pathResolver(slug)}>{name}</Link>
        </ScContentItem>
        {!isEmpty(content) && (
          <ScContentItem>
            <PostAuthorContent
              dangerouslySetInnerHTML={{
                __html: marked(content.replace(/(\r\n|\n|\r)+/gm, '<br>'), { renderer }),
              }}
            />
          </ScContentItem>
        )}
      </ScContentWrapper>
    </ScFlexWrapper>
  )
}

PostAuthorSingleLayout.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })
  ).isRequired,
  imageSize: PropTypes.string,
  withFancyHeader: PropTypes.bool,
  columnGap: PropTypes.string,
}

PostAuthorSingleLayout.defaultProps = {
  imageSize: '100px',
  withFancyHeader: false,
  columnGap: '',
}

export default PostAuthorSingleLayout
