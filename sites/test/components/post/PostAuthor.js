import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

import FancyHeader from '../FancyHeader'
import LINE_MEET_AUTHOR from '../../statics/images/line-meet-author.svg'
import ICON_AUTHOR from '../../statics/images/icon-author.svg'

import PostAuthorSingleLayout from './PostAuthorSingleLayout'
import PostAuthorMultiLayout from './PostAuthorMultiLayout'
import { MEDIA } from '../../utils/styles'

const FancyTitleWithMargin = styled(FancyHeader)`
  ${MEDIA.MOBILE`margin-bottom: 20px;`}
  ${MEDIA.TABLET`margin-bottom: 30px;`}
  ${MEDIA.DESKTOP`margin-bottom: 40px;`}
  ${props => props.isCenter && `text-align: center;`}
`
const FancyMultipleTitleMargin = styled(FancyHeader)`
  ${props => props.isCenter && `text-align: center;`}
  ${MEDIA.TABLET`margin-bottom: 28px;`}
  ${MEDIA.DESKTOP`margin-bottom: 28px;`}
`
/*----------------------------------------------------------------------------------
 *  COMPONENTS
 *---------------------------------------------------------------------------------*/

const PostAuthor = ({ authors }) => {
  const { isDesktop, isMobile } = useContext(DetectDeviceContext)
  const isMultipleAuthors = authors.length > 1
  const title = `MEET THE AUTHOR${isMultipleAuthors ? 'S' : ''}`
  const FancyTitle = isMultipleAuthors ? FancyMultipleTitleMargin : FancyTitleWithMargin
  const AuthorSection = !isMultipleAuthors ? PostAuthorSingleLayout : PostAuthorMultiLayout

  return (
    <div>
      {/* header text */}
      <FancyTitle
        isCenter={isMobile}
        title={title}
        iconImage={ICON_AUTHOR}
        underlineImage={LINE_MEET_AUTHOR}
        underlineImageMargin={isDesktop ? '-5px 0 20px' : null}
        isUnderlineImageCenterAlign={isMobile}
        withCenterLayout={false}
        titleClassName="font-section-header-2"
      />

      {/* author information */}
      <AuthorSection authors={authors} />
    </div>
  )
}

PostAuthor.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })
  ).isRequired,
}

export default PostAuthor
