import APP_CONFIGS from '../configs/app'
import { detectDeviceType } from 'wsc/utils/detectDeviceType'

const { isMobile, isTablet } = detectDeviceType()

const adConfig = {
  au1: '006_LittleThings',
  globalPrebid: {
    ix: {
      firstPartyData: {
        PD: isMobile ? 'Phone' : isTablet ? 'Tablet' : 'Desktop',
        P29: localStorage.getItem('locale') || APP_CONFIGS.language, // language of this site
      },
    },
  },
  globalTargeting: {
    lang: localStorage.getItem('locale') || APP_CONFIGS.language,
  },
}

export default adConfig
