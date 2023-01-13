import React, { useContext, useRef, useEffect, useState } from 'react'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import Link from 'wsc/components/Link'
import styled from 'styled-components'
import { ReactComponent as up } from '../../statics/images/icon-nav-up.svg'
import { ReactComponent as down } from '../../statics/images/down-arrow.svg'
import { withLineClamp, COLORS } from '../../utils/styles'
import { MEDIA } from '../../utils/styles'
import { useTranslator } from '../../hooks/useTranslator'
import APP_CONFIGS from '../../configs/app'
import PropTypes from 'prop-types'

const lineHeight = 25
const contextline = {
  mobileLines: 3,
  tabletLines: 3,
  defaultLines: 3,
}

const ContentText = styled.div`
  font-size: 0.75rem;
  ${MEDIA.DESKTOP`font-size: 0.69rem;`}
  line-height: ${lineHeight}px;
  ${props => props.isTruncated && withLineClamp(contextline)}
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
  font-size: 0.75rem;
  ${MEDIA.DESKTOP`font-size: 0.69rem;`}
`
const ScWrapper = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
`

const PostDisclaimer = ({ type }) => {
  const { isMobile } = useContext(DetectDeviceContext)
  const refContainer = useRef(null)
  const [isTruncated, setIsTruncated] = useState(true)
  const [shouldTruncated, setShouldTruncated] = useState(false)
  const [viewWidth, setViewWidth] = useState(window.innerWidth)
  const { translator, locale } = useTranslator()
  useEffect(() => {
    const line = isMobile ? contextline.mobileLines : contextline.defaultLines
    setShouldTruncated(refContainer.current.scrollHeight > lineHeight * line)
    const handleResize = () => {
      setViewWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobile, viewWidth, locale])

  type = type.toLowerCase()
  return (
    <React.Fragment>
      <ScWrapper>
        <ContentText isTruncated={isTruncated}>
          <div ref={refContainer}>
            {type === 'reddit' ? (
              translator(`disclaimer.${type}.details`)
            ) : (
              <>
                {translator(`disclaimer.${type}.details`)}
                <Link to={APP_CONFIGS.url}>{APP_CONFIGS.name}</Link>
                {translator(`disclaimer.${type}.restDetails`)}
              </>
            )}
          </div>
        </ContentText>
        {shouldTruncated && (
          <div>
            <Toggle
              to={'/'}
              onClick={e => {
                e.preventDefault()
                setIsTruncated(!isTruncated)
              }}
            >
              {isTruncated ? translator('global.viewMore') : translator('global.viewLess')}
            </Toggle>
            {isTruncated ? <RegDown /> : <RegUp />}
          </div>
        )}
      </ScWrapper>
    </React.Fragment>
  )
}

PostDisclaimer.propTypes = {
  type: PropTypes.oneOf(['Generic', 'Shoppable', 'Reddit']).isRequired,
}
export default PostDisclaimer
