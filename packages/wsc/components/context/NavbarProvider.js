import React, { useState } from 'react'
import PropTypes from 'prop-types'

const NavbarStateContext = React.createContext(null)
const NavbarControlContext = React.createContext(null)

const NavbarProvider = props => {
  const [isNavbarMobileOpen, SetIsNavBarMobileOpen] = useState(false)
  return (
    <NavbarStateContext.Provider value={isNavbarMobileOpen}>
      <NavbarControlContext.Provider value={SetIsNavBarMobileOpen}>
        {props.children}
      </NavbarControlContext.Provider>
    </NavbarStateContext.Provider>
  )
}

NavbarProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { NavbarProvider, NavbarStateContext, NavbarControlContext }
