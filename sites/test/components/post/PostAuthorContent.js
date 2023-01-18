import React, { useContext, useRef, useEffect, useState } from 'react'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import Link from 'wsc/components/Link'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import up from '../../statics/images/icon-nav-up.svg'
import down from '../../statics/images/down-arrow.svg'
import { withLineClamp, COLORS } from '../../utils/styles'
import { MEDIA } from '../../utils/styles'

const lineHeight = 25
const contextline = {
  mobileLines: 2,
  tabletLines: 2,
  desktopLines: 3,
}

const ContentText = styled.div`
  line-height: ${lineHeight}px;
  ${(props) => props.isTruncated && withLineClamp(contextline)}
`
const regProps = `
  fill: ${COLORS.BLACK}
  width: 8.4px;
  height: 4.5px;
  margin-bottom: 1px;
  margin-left: 4.9px;`
const RegUp = styled(up)`
  ${regProps}
`
const RegDown = styled(down)`
  ${regProps}
`
const Toggle = styled(Link)`
  font-size: 11.3px;
  ${MEDIA.MOBILE`font-size: 12.6px;`}
`

const PostAuthorContent = ({ dangerouslySetInnerHTML }) => {
  const { isMobile, isTablet } = useContext(DetectDeviceContext)
  const refContainer = useRef(null)
  const [isTruncated, setIsTruncated] = useState(true)
  const [shouldTruncated, setShouldTruncated] = useState(false)
  useEffect(() => {
    const line = isMobile
      ? contextline.mobileLines
      : isTablet
      ? contextline.tabletLines
      : contextline.desktopLines
    setShouldTruncated(refContainer.current.scrollHeight > lineHeight * line)
  }, [isMobile, isTablet, dangerouslySetInnerHTML])

  return (
    <div>
      <ContentText isTruncated={isTruncated}>
        <div
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          ref={refContainer}
        />
      </ContentText>
      {shouldTruncated && (
        <div>
          <Toggle
            to={'/'}
            onClick={(e) => {
              e.preventDefault()
              setIsTruncated(!isTruncated)
            }}
          >
            {isTruncated ? 'READ MORE' : 'VIEW LESS'}
          </Toggle>
          {isTruncated ? <RegDown /> : <RegUp />}
        </div>
      )}
    </div>
  )
}

PostAuthorContent.propTypes = {
  dangerouslySetInnerHTML: PropTypes.object.isRequired,
}

export default PostAuthorContent
