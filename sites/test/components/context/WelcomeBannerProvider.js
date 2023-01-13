import React, { useState } from 'react'
import PropTypes from 'prop-types'

const WelcomeBannerStateContext = React.createContext(null)

const WelcomeBannerProvider = props => {
  const [isHideWelcomeBar, setIsHideWelcomeBar] = useState(false)
  const [isMoveWelcomeBar, setIsMoveWelcomeBar] = useState(false)
  return (
    <WelcomeBannerStateContext.Provider
      value={{ isHideWelcomeBar, setIsHideWelcomeBar, isMoveWelcomeBar, setIsMoveWelcomeBar }}
    >
      {props.children}
    </WelcomeBannerStateContext.Provider>
  )
}

WelcomeBannerProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { WelcomeBannerProvider, WelcomeBannerStateContext }
