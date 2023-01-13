import { useState, useEffect } from 'react'
import { detectDeviceType } from '../utils/detectDeviceType'
import { getConfig } from '../globalConfig'

const { DEVICE_MINWIDTH } = getConfig('StyleConfig')
/**
 * Detect whether the device is mobile, tablet or desktop according to screen width
 * @returns {{ isMobile: boolean, isTablet: boolean, isDesktop: boolean }}
 */
export const useDetectDevice = () => {
  const [device, setDevice] = useState(detectDeviceType())
  useEffect(() => {
    const handleResize = () => {
      // isMobile_S
      if (!device.isMobile_S && window.innerWidth < DEVICE_MINWIDTH.MOBILE) {
        setDevice({
          isMobile_S: true,
          isMobile_L: false,
          isMobile: true,
          isTablet: false,
          isDesktop: false,
        })
        // isMobile_L
      } else if (
        !device.isMobile_L &&
        window.innerWidth >= DEVICE_MINWIDTH.MOBILE &&
        window.innerWidth < DEVICE_MINWIDTH.TABLET
      ) {
        setDevice({
          isMobile_S: false,
          isMobile_L: true,
          isMobile: true,
          isTablet: false,
          isDesktop: false,
        })
        // isTablet
      } else if (
        !device.isTablet &&
        window.innerWidth >= DEVICE_MINWIDTH.TABLET &&
        window.innerWidth < DEVICE_MINWIDTH.DESKTOP
      ) {
        setDevice({
          isMobile_S: false,
          isMobile_L: false,
          isMobile: false,
          isTablet: true,
          isDesktop: false,
        })
        // isDesktop
      } else if (!device.isDesktop && window.innerWidth >= DEVICE_MINWIDTH.DESKTOP) {
        setDevice({
          isMobile_S: false,
          isMobile_L: false,
          isMobile: false,
          isTablet: false,
          isDesktop: true,
        })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [device])

  return device
}
