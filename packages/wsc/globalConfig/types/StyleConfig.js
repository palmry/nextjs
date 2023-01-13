import PropTypes from 'prop-types'

const shape = {
  COLORS: PropTypes.shape({}),
}

const defaultObj = {
  COLORS: {
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    GREY: '#AAAAAA',
    GRAY: '#EEEEEE',
    DARK_GRAY: '#676767',
    LIGHT_GRAY: '#CCCCCC',
    VERY_LIGHT_GREY: '#E5E5E5',
    BORDER_GREY: '#E2E6EB',
    BORDER_GREY_2: '#D8D8D8',
    LETTER_GREY: '#AAB0BB',
    BACKGROUND_GREY: '#F9FAFC',
    BLOOD_ORANGE: '#F34E00',
    GREEN: '#003B49',
    DARK_GREEN: '#146A61',
    VERY_LIGHT_GREEN: '#6D9DAA',
    LIGHT_YELLOW: '#FCF6DA',
    YELLOW: '#F0D348',
    DARK_YELLOW: '#d5b834',
    DARKER_YELLOW: '#BC941F',
    WARM_YELLOW: '#F8C31B',
    PALE_SALMON: '#F9B2A0',
    DARK_PALE_SALMON: '#C78E80',
    BLUE: '#436ebf', //social button fow follow-us section
    LIGHT_BLUE: '#00B6BD',
    VERY_LIGHT_BLUE: '#DEE9FF',
    PASTEL_BLUE: '#9BBEFF',
    DARK_BLUE: '#00838B',
    SOFT_BLUE: '#5892FF',
    TWILIGHT_BLUE: '#0B4667',
    TWILIGHT_BLUE_90: 'rgba(11, 70, 103, 0.9)',
    TWILIGHT_BLUE_60: 'rgba(11, 70, 103, 0.6)',
    BLACK_BLUE: '#013a49',
    BUBBLEGUM: '#FB6ECF',
    BROWN: '#bc941f',
    GREYISH_TEAL: '#72A6A0',
    VERY_LIGHT_ORANGE: '#FFF5E8',
    PALE_ORANGE: '#F89566',
    LIGHT_PALE_ORANGE: '#FDDCCC',
    PALE_MAUVE: '#FEE2F5',
    POWDER_PINK: '#FDA9E2',
    DUCK_EGG_BLUE: '#D0E1DF',
    // custom
    BLUE_TALE: '#5993ff',
    BLUE_TALE_08: '#5993ff14',
    BLUE_EXTRA_DARK: '#08354d',
    VERY_LIGHT_PINK: '#fc6fcf',
    SPECIAL_PINK: '#fc78d2',
    PURPLE: '#6f1cc9',
    DISABLE: '#cccccc',
    // valentine
    VALENTINE_PINK: '#FE7AB3',
    VALENTINE_LIGHT_PINK: '#FAE0EC',
    VALENTINE_DARK_PINK: '#861137',
    // mothers day
    MOTHERS_DAY_PINK: '#EB77AF',
    MOTHERS_DAY_DARK_PINK: '#ED2991',
    MOTHERS_DAY_YELLOW: '#F0D353',
    MOTHERS_DAY_GREEN: '#A8CD8B',
    // fathers day
    FATHERS_DAY_BLUE: '#5993FF',
    FATHERS_DAY_DARK_GREY_BLUE: '#323D5C',
    FATHERS_DAY_YELLOW: '#F8C31B',
    FATHERS_DAY_ORANGE: '#F34E00',
    FATHERS_DAY_SOFT_ORANGE: '#FEF3D1',
    // first day of school
    SCHOOL_DAY_BLUE: '#A2F2FF',
    SCHOOL_DAY_PINK: '#FF50A4',
    SCHOOL_DAY_ORANGE: '#F4662F',
    SCHOOL_DAY_GREEN: '#C5FF12',
    SCHOOL_DAY_PURPLE: '#A989F9',
    // Halloween
    HALLOWEEN_PURPLE: '#7956CC',
    HALLOWEEN_LIGHT_PURPLE: '#DFD6F3',
    HALLOWEEN_ORANGE: '#F79952',
    HALLOWEEN_GREEN: '#43BF5E',
    HALLOWEEN_SOFT_GREEN: '#B4E5BF',
    HALLOWEEN_PINK: '#FFA4DE',
    // Sweepstakes
    SWEEPSTAKES_PINK: '#FFF3FB',
    // Thanksgiving
    THANKSGIVING_BROWN: '#D5AE98',
    THANKSGIVING_SOFT_BROWN: '#E4CBBD',
    THANKSGIVING_ORANGE: '#DD4317',
    THANKSGIVING_DARK_ORANGE: '#B5360F',
    THANKSGIVING_SOFT_ORANGE: '#EEDFD6',
    // Holiday
    HOLIDAY_RED: '#DA0002',
    HOLIDAY_SOFT_RED: '#FD5656',
    HOLIDAY_BROWN: '#873E22',
    HOLIDAY_SOFT_BROWN: '#EDD9B7',
    HOLIDAY_ORANGE: '#DEA225',
    HOLIDAY_DARK_ORANGE: '#C69021',
    HOLIDAY_SOFT_ORANGE: '#F9F6E3',
    HOLIDAY_GREEN: '#134D36',
    HOLIDAY_SOFT_GREEN: '#196A4A',
    HOLIDAY_DARK_GREY_BLUE_08: '#323D5C14',

    // form
    FOCUS: '#5993ff',
    VALID: '#12ac4d',
    ERROR: '#ff0000',
  },
  FOOTER_HEIGHT: {
    MOBILE: 580, // px
    TABLET: 478, // px
    DESKTOP: 368, // px
  },
  NAVIGATION_BAR_HEIGHT: 70, // px
  PREVIEW_SITE_BAR_HEIGHT: 40, // px
  DEVICE_MINWIDTH: {
    MOBILE_S: 320,
    MOBILE: 414, // < MOBILE  is mobile_s (use only when it has 4 design views)
    TABLET: 768, // < TABLET  is mobile
    DESKTOP: 1128, // < DESKTOP  = tablet,  >= DESKTOP is Desktop
  },
  PADDINGS: {
    DEFAULT: {
      MOBILE: 23,
    },
  },
  PAGE_WIDTHS: {
    // mobile is 100%, then use paddings instead
    TABLET: 608, // px
    DESKTOP: 1088, // px
  },
  FONT_FAMILIES: {
    SERIF: `'Playfair Display', serif`,
    SANSSERIF: `'Open Sans', sans-serif`,
    JWPLAYER: `'JW Player Font Icons'`,
  },
  POST_ITEM_IMAGE_TYPE: {
    SQUARE_IMAGE: 'square-image',
    FULL_WIDTH_IMAGE: 'full-width-image',
    DYNAMIC_SIZE_IMAGE: 'dynamic-size-image',
  },
}

export default {
  shape,
  defaultObj,
}
