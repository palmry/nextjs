import { getConfig } from '../globalConfig'

const { DEVICE_MINWIDTH } = getConfig('StyleConfig')

export const detectDeviceType = () => {
  return {
    isMobile_S: window.innerWidth < DEVICE_MINWIDTH.MOBILE,
    isMobile_L:
      window.innerWidth >= DEVICE_MINWIDTH.MOBILE && window.innerWidth < DEVICE_MINWIDTH.TABLET,
    isMobile: window.innerWidth < DEVICE_MINWIDTH.TABLET,
    isTablet:
      window.innerWidth >= DEVICE_MINWIDTH.TABLET && window.innerWidth < DEVICE_MINWIDTH.DESKTOP,
    isDesktop: window.innerWidth >= DEVICE_MINWIDTH.DESKTOP,
  }
}
