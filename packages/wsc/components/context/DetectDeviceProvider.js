import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDetectDevice } from '../../hooks/useDetectDevice'

export const DetectDeviceContext = React.createContext(null)

const DetectDeviceProvider = props => {
  const { isMobile_S, isMobile_L, isMobile, isTablet, isDesktop } = useDetectDevice()

  // Protect re-render when this component is updated but each values stay the same
  const context = useMemo(() => {
    return { isMobile_S, isMobile_L, isMobile, isTablet, isDesktop }
  }, [isMobile_S, isMobile_L, isMobile, isTablet, isDesktop])

  return (
    <DetectDeviceContext.Provider value={context}>{props.children}</DetectDeviceContext.Provider>
  )
}

DetectDeviceProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DetectDeviceProvider
