import PropTypes from 'prop-types'

const shape = {
  en: PropTypes.shape({}),
}

const defaultObj = {
  en: {
    global: {
      markdownText: 'TWEET THIS',
    },
  },
}

export default {
  shape,
  defaultObj,
}
