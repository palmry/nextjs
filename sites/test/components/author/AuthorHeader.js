import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { MEDIA, FONT_FAMILIES } from '../../utils/styles'

import { ReactComponent as sharp } from '../../statics/images/sharp.svg'

import AuthorInfo from '../AuthorInfo'
import AuthorTopic from './AuthorTopic'

const ScWrapper = styled.div`
  margin-top: 50px;

  ${MEDIA.MOBILE`
    margin-top: 30px;
    margin-bottom: 43px;
    `}
  ${MEDIA.TABLET`margin-bottom: 53px;`}
  ${MEDIA.DESKTOP`margin: 50px 115px 63px;`}
`
const IconSharp = styled(sharp)`
  width: 21px;
  height: 25px;
  vertical-align: middle;
  margin-right: 6px;
  margin-bottom: 5px;
`

const PopularTopic = styled.div`
  font-family: ${FONT_FAMILIES.POPPINS};
  vertical-align: middle;
  text-align: center;
  padding-bottom: 10px;
  margin-top: 30px;

  font-size: 1.25rem;
  ${MEDIA.TABLET` font-size: 1.19rem;`}
  ${MEDIA.MOBILE` font-size: 1.13rem;`}
`
const AuthorTopicWrapper = styled.div`
  max-height: 68px;
  ${MEDIA.TABLET` max-height: 64px;`}
  ${MEDIA.MOBILE` max-height: 90px;`}
  overflow-y: hidden;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AuthorHeader = ({ author, neverShowImageFrame, withSharpIcon, ...restProps }) => {
  const { isMobile, isTablet } = useContext(DetectDeviceContext)
  const imageSize = isMobile ? '100px' : isTablet ? '125px' : '150px'

  return (
    <ScWrapper>
      <AuthorInfo
        authors={[author]}
        withCenterLayout={isMobile}
        imageSize={imageSize}
        withFrame={neverShowImageFrame ? false : !isMobile}
        columnGap={'25px'}
        {...restProps}
      />

      <PopularTopic>
        {withSharpIcon && <IconSharp />}
        POPULAR TOPICS
      </PopularTopic>
      <AuthorTopicWrapper>
        <AuthorTopic author={author.sys.id}></AuthorTopic>
      </AuthorTopicWrapper>
    </ScWrapper>
  )
}

AuthorHeader.propTypes = {
  author: PropTypes.object.isRequired,
  neverShowImageFrame: PropTypes.bool,
  withSharpIcon: PropTypes.bool,
}

AuthorHeader.defaultProps = {
  neverShowImageFrame: false,
  withSharpIcon: true,
}

export default AuthorHeader
