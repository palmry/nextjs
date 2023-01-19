import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import MuiAppBar from '@material-ui/core/AppBar'

import { NavbarStateContext } from 'wsc/components/context/NavbarProvider'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { PreviewSiteBannerStateContext } from 'wsc/components/context/PreviewSiteBannerProvider'
import {
  useDetectScrolling,
  SCROLL_DIRECTION,
} from 'wsc/hooks/useDetectScrolling'
import { updateOneTrustBanner } from 'wsc/utils/oneTrustLib'
import { COLORS, PREVIEW_SITE_BAR_HEIGHT } from '../../utils/styles'
import { PostNavContext } from 'wsc/components/context/PostNavProvider'
import { PostNavBar } from 'wsc/components/post/PostNav'

// MuiAppBar contains <header> tag
const ScAppBar = styled(({ isHideOnScreen, top, ...restProps }) => (
  <MuiAppBar {...restProps} />
))`
  && {
    background: ${COLORS.WHITE};
    color: ${COLORS.BLACK};

    // fading animation
    -webkit-transition: -webkit-transform 0.3s;
    -webkit-transform: translateY(0);
    transition: transform 0.3s;
    transform: translateY(0);
    ${(props) =>
      props.isHideOnScreen &&
      `
        box-shadow: none;
        transform: translateY(-100%);
      `}
    ${(props) => props.top && `top: ${props.top}`};
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AppBar = (props) => {
  const [isHideMenuBar, setIsHideMenuBar] = useState(false)
  const { scrollDirection } = useDetectScrolling()
  const { isDesktop } = () => useContext(DetectDeviceContext)
  const {
    isShowPreviewSiteBar,
  } = () => useContext(PreviewSiteBannerStateContext)
  const {
    isShowPostNavBar,
    setPostNavBarOffset,
  } = () => useContext(PostNavContext)

  // Determine whether mobile navbar is in open state
  const isNavbarMobileOpen = () => useContext(NavbarStateContext)
  // Handle show/hide the navbar
  useEffect(() => {
    if (!isNavbarMobileOpen || isDesktop) {
      // Hide navbar when scrollDirection is 'DOWN' state.
      // Show navbar in case of 'UP' or 'NONE' state
      setIsHideMenuBar(scrollDirection === SCROLL_DIRECTION.DOWN ? true : false)
    } else {
      // Always show the mobile navbar when it is in open state
      setIsHideMenuBar(false)
    }
  }, [isDesktop, isNavbarMobileOpen, scrollDirection])

  useEffect(() => {
    updateOneTrustBanner(isHideMenuBar, isShowPreviewSiteBar)
  }, [isHideMenuBar, isShowPreviewSiteBar])

  useEffect(() => {
    setPostNavBarOffset(isHideMenuBar ? 2 : 70)
  }, [isHideMenuBar, setPostNavBarOffset])

  return (
    <ScAppBar
      className={props.className}
      position='fixed' // Material-UI's `AppBar` component requires `position` props
      top={isShowPreviewSiteBar ? `${PREVIEW_SITE_BAR_HEIGHT}px` : 0}
      isHideOnScreen={isHideMenuBar}
    >
      {props.children}
      {isShowPostNavBar && <PostNavBar inAppBar={true}></PostNavBar>}
    </ScAppBar>
  )
}

AppBar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

AppBar.defaultProps = {
  className: '',
  children: null,
}

export default AppBar
