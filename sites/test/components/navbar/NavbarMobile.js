import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
// import { withRouter } from 'react-router-dom'
import {
  NavbarStateContext,
  NavbarControlContext,
} from 'wsc/components/context/NavbarProvider'
import AppBar from './AppBar'
import HamburgerButton from './HamburgerButton'
import Logo from './Logo'

import MuiToolbar from '@material-ui/core/Toolbar'
import MenuMobile from './MenuMobile'
import { MEDIA, PAGE_WIDTHS, PADDINGS, COLORS } from '../../utils/styles'

const ScToolbar = styled(MuiToolbar)`
  && {
    padding-top: 20px;
    padding-bottom: 20px;
    min-height: unset;
    margin: auto;
    overflow-y: hidden;

    // padding only exists on mobile
    padding-left: ${PADDINGS.DEFAULT.MOBILE}px;
    padding-right: ${PADDINGS.DEFAULT.MOBILE}px;

    ${MEDIA.TABLET`
      width: ${PAGE_WIDTHS.TABLET}px;
      padding-left: 0px;
      padding-right: 0px;
    `}
  }
`
const ScContainer = styled.div`
  // relative for search input
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`

const ScNavbar = styled.nav`
  background: ${COLORS.WHITE};
  width: 100%;
`

const ScTempSearchReplacement = styled.div`
  width:30px
  height:30px;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const NavbarMobile = () => {
  const isNavbarMobileOpen = useContext(NavbarStateContext)
  const setIsNavBarMobileOpen = useContext(NavbarControlContext)
  // search bar: external state

  // hamburgur button: onclick event
  const onClickMobileMenuButton = () => {
    setIsNavBarMobileOpen(!isNavbarMobileOpen)
  }
  // each nav item: onclick event
  const onClickMobileMenuItem = () => {
    setIsNavBarMobileOpen(false)
  }

  return (
    <AppBar>
      <ScNavbar>
        <ScToolbar>
          <ScContainer>
            <HamburgerButton
              onClickMobileMenuButton={onClickMobileMenuButton}
              isOpenMobileMenu={isNavbarMobileOpen}
            />
            <Logo />
            <ScTempSearchReplacement />
          </ScContainer>
        </ScToolbar>
        <MenuMobile
          isOpen={isNavbarMobileOpen}
          onClickMenuItem={onClickMobileMenuItem}
        />
      </ScNavbar>
    </AppBar>
  )
}

NavbarMobile.propTypes = {}
NavbarMobile.defaultProps = {}

export default NavbarMobile
