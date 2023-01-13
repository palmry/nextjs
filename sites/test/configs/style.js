import { setConfig, getConfig } from 'wsc/globalConfig'

const styleConfig = {
  COLORS: {
    LT_DARK_GREY_BLUE: '#323D5C',
    LT_DARK_GREY_BLUE_08: '#323D5C14',
    LT_DARK_GREY_BLUE_TRANSPARENT: '#323D5CE6',
    LT_DARK_BLUE: '#242C42',
    LT_LIGHT_BLUE: '#00B6BD',
    LT_LIGHT_YELLOW: '#F9E375',
    LT_SUN_YELLOW: '#F7D629',
    LT_DARK_SUN_YELLOW: '#B89E1F',
    LT_LIGHT_PEACH: '#F09989',
    LT_DARK_PEACH: '#E57463',
    LT_VERY_DARK_PEACH: '#B35A4D',
    LT_HOSPITAL_GREEN: '#A3D4A7',
    LT_AQUA_MARINE: '#54C4CB',
    LT_VERY_LIGHT_GRAY: '#EEEEEE',
    LT_GRAY: '#676767',
    LT_DARK_GRAY: '#666666',
    LT_LIGHT_GRAY: '#CCCCCC',
    LT_DARK_ORANGE: '#E06638',
    LT_DARK_GREEN: '#00625F',
    LT_LIGHT_GREEN: '#9EDBDF',
    LT_BLUE: '#59D0D9',
    LT_DARK_BROWN: '#AD4E2B',
    LT_WEBINAR_DARK_GREEN: '#0B514D',
    LT_WEBINAR_LIGHT_GREEN: '#DDECD3',
  },
  FONT_FAMILIES: {
    SERIF: `'Playfair Display', serif`,
    SANSSERIF: `'Open Sans', sans-serif`,
    JWPLAYER: `'JW Player Font Icons'`,
    POPPINS: `'Poppins', sans-serif`,
    ASAP: `'Asap', sans-serif`,
  },
}

setConfig('StyleConfig', styleConfig)

export default getConfig('StyleConfig')
