import React, { useContext } from 'react'
import { AdSlot } from 'wsc'
import { getConfig } from 'wsc/globalConfig'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { MEDIA, PAGE_WIDTHS, PADDINGS } from '../utils/styles'
import { getActivePost } from 'wsc'
import { getPostTargeting } from 'wsc/utils/postTargeting'
import { useRefreshInterval } from '../hooks/useRefreshInterval'

const { footerRefreshMS } = getConfig('AdConfig')

const Container = styled.div`
  position: fixed;
  z-index: 10000;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;

  ${MEDIA.MOBILE`
    margin-left: -${PADDINGS.DEFAULT.MOBILE}px;
  `}
  ${MEDIA.TABLET`width: -${PAGE_WIDTHS.TABLET}px;`}
  ${MEDIA.DESKTOP`width: -${PAGE_WIDTHS.DESKTOP}px;`}
`
const AdFooter = (props) => {
  const { isMobile } = useContext(DetectDeviceContext)
  const { refreshAd } = props
  let { targeting } = props

  if (targeting === null) {
    const activePost = getActivePost()
    targeting = activePost ? getPostTargeting(activePost) : {}
  }

  const [setEnabled, resetInterval] = useRefreshInterval(
    !refreshAd,
    footerRefreshMS
  ) //useRef(null)

  const adRenderCallback = (event) => {
    setEnabled(true)
    if (event.size[0] !== 555) return
    if (event.size[1] === 55) {
      //celtra full page unit with border
      setEnabled(false)
    } else if (event.size[1] === 56) {
      //potential future celtra unit
      setEnabled(true)
      resetInterval(60000)
    }
  }

  return (
    <>
      {isMobile && (
        <Container>
          <AdSlot
            {...props}
            au3="footer"
            showCallout={false}
            targeting={targeting}
            callback={adRenderCallback}
          />
        </Container>
      )}
    </>
  )
}

AdFooter.propTypes = {
  refreshAd: PropTypes.bool,
  targeting: PropTypes.object,
}

AdFooter.defaultProps = {
  refreshAd: true,
  targeting: null,
}

export default AdFooter
