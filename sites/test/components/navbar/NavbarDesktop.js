import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import DefaultAppBar from './AppBar'
import Logo from './Logo'
import MenuDesktop from './MenuDesktop'
import { menuBarTransitionStyle } from './sharedStyles'
import { PAGE_WIDTHS, NAVIGATION_BAR_HEIGHT, COLORS } from '../../utils/styles'

const AppBar = styled(DefaultAppBar)`
  /* Material-ui's default css are:
  display: flex;
  flex-direction: column;
  */

  /* Add more rules */
  && {
    flex-direction: row;
    justify-content: center;
    height: ${NAVIGATION_BAR_HEIGHT}px;
  }
`
const ScNavbar = styled.nav`
  background: ${COLORS.WHITE};
  width: 100%;
  z-index: 1;
`
const ScFlexMenuBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`
const ScFlexContentContainer = styled.div`
  // relative for search input
  position: relative;

  display: flex;
  margin: auto;
  width: ${PAGE_WIDTHS.DESKTOP}px;
  justify-content: space-between;
`
const ScLogo = styled.div`
  align-self: center;
`
const ScFlexWrapper = styled.ul`
  display: flex;
  ${menuBarTransitionStyle}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const NavbarDesktop = () => {
  return (
    <AppBar>
      <ScNavbar>
        <ScFlexContentContainer>
          <ScFlexMenuBox>
            <ScLogo>
              <Logo />
            </ScLogo>
            <ScFlexWrapper>
              <MenuDesktop />
            </ScFlexWrapper>
          </ScFlexMenuBox>
        </ScFlexContentContainer>
      </ScNavbar>
    </AppBar>
  )
}

NavbarDesktop.propTypes = {
  // history: PropTypes.shape({
  //   push: PropTypes.func,
  // }).isRequired,
}
NavbarDesktop.defaultProps = {}

export default NavbarDesktop
