import PropTypes from 'prop-types'

const shape = {
  url: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  logo: PropTypes.string,
  description: PropTypes.string,
  language: PropTypes.string,
  envUrl: PropTypes.string,
  locales: PropTypes.shape({}),
  // Max number of posts to load via infinite scroll
  maxInfiniteScrollPosts: PropTypes.number,
  // Number of pixels to look ahead of scroll to preload next article
  infiniteScrollLookahead: PropTypes.number,
  languageList: PropTypes.arrayOf(PropTypes.string),
  prop30SiteName: PropTypes.string,
}

const defaultObj = {
  language: 'en',
  // Max number of posts to load via infinite scroll
  maxInfiniteScrollPosts: 3,
  // Number of pixels to look ahead of scroll to preload next article
  infiniteScrollLookahead: 2000,
  languageList: ['en'],
}

export default {
  shape,
  defaultObj,
}
