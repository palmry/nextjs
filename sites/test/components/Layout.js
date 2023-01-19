import React, { useContext, lazy } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { PreviewSiteBannerStateContext } from 'wsc/components/context/PreviewSiteBannerProvider'
import {
  MEDIA,
  PAGE_WIDTHS,
  PADDINGS,
  NAVIGATION_BAR_HEIGHT,
  PREVIEW_SITE_BAR_HEIGHT,
} from '../utils/styles'

import PreviewSiteBanner from 'wsc/components/PreviewSiteBanner'
import NavbarMobile from './navbar/NavbarMobile'
import NavbarDesktop from './navbar/NavbarDesktop'
import SubscribePopup from './SubscribePopup'
import ReactComponentLoader from 'wsc/components/ReactComponentLoader'

export const LAYOUT_MINWIDTH = 320

const Footer = lazy(() => import('./footer/Footer'))

const ScWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  min-width: ${LAYOUT_MINWIDTH}px;
  min-height: 100vh;
  ${MEDIA.MOBILE`
    overflow-x: hidden;
  `}
  ${(props) => props.paddingTop && `padding-top: ${props.paddingTop};`}
`
const ScContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  flex-grow: 1; // for making Footer is always on bottom
  ${(props) =>
    props.contentVerticalPadding &&
    `padding-top: ${props.contentVerticalPadding};
    padding-bottom: ${props.contentVerticalPadding};`}

  ${MEDIA.MOBILE`
    padding-left: ${PADDINGS.DEFAULT.MOBILE}px;
    padding-right: ${PADDINGS.DEFAULT.MOBILE}px;
    `}
    ${MEDIA.TABLET`width: ${PAGE_WIDTHS.TABLET}px;`}
    ${MEDIA.DESKTOP`width: ${PAGE_WIDTHS.DESKTOP}px;`}

    ${(props) => props.fullscreen && MEDIA.MOBILE`padding: 0;`}
    ${(props) => props.fullscreen && MEDIA.TABLET`width: 100%;`}
    ${(props) => props.fullscreen && MEDIA.DESKTOP`width: 100%;`}
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const Layout = (props) => {
  const { children, contentVerticalPadding } = props
  const { isDesktop } = () => useContext(DetectDeviceContext)
  const {
    isShowPreviewSiteBar,
  } = () => useContext(PreviewSiteBannerStateContext)
  const wrapperPaddingTop = isShowPreviewSiteBar
    ? `${NAVIGATION_BAR_HEIGHT + PREVIEW_SITE_BAR_HEIGHT}px`
    : `${NAVIGATION_BAR_HEIGHT}px`

  return (
    <ScWrapper paddingTop={wrapperPaddingTop}>
      <PreviewSiteBanner />
      {isDesktop ? <NavbarDesktop /> : <NavbarMobile />}
      <ScContainer
        fullscreen={props.fullscreen}
        contentVerticalPadding={contentVerticalPadding}
      >
        {children}
      </ScContainer>
      <ReactComponentLoader>
        <Footer />
      </ReactComponentLoader>
      <SubscribePopup key={`popup-key}`} />
    </ScWrapper>
  )
}

Layout.propTypes = {
  contentVerticalPadding: PropTypes.string,
  children: PropTypes.node.isRequired,
  fullscreen: PropTypes.bool,
}

Layout.defaultProps = {
  fullscreen: false,
  contentVerticalPadding: null,
}

export default Layout
