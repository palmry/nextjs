import { getConfig } from '../globalConfig'
import { useEffect, useState } from 'react'
const { DEVICE_MINWIDTH } = getConfig('StyleConfig')

export const detectDeviceType = () => {
  const [device, setDevice] = useState({
    isMobile_S: false,
    isMobile_L: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })

  useEffect(
    () =>
      setDevice({
        isMobile_S: window.innerWidth < DEVICE_MINWIDTH.MOBILE,
        isMobile_L:
          window.innerWidth >= DEVICE_MINWIDTH.MOBILE &&
          window.innerWidth < DEVICE_MINWIDTH.TABLET,
        isMobile: window.innerWidth < DEVICE_MINWIDTH.TABLET,
        isTablet:
          window.innerWidth >= DEVICE_MINWIDTH.TABLET &&
          window.innerWidth < DEVICE_MINWIDTH.DESKTOP,
        isDesktop: window.innerWidth >= DEVICE_MINWIDTH.DESKTOP,
      }),
    []
  )
  return device
}
