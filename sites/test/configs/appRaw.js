const APP_CONFIGS = {
  // process.env.DEPLOY_PRIME_URL is a built-in environment variable from netlify
  url:
    process.env.BRANCH && process.env.BRANCH !== 'master'
      ? process.env.DEPLOY_PRIME_URL
      : 'https://littlethings.com',
  name: 'LittleThings.com',
  title: 'Family, Parenting, Pet and Lifestyle Tips That Bring Us Closer Together',
  logo: '/images/logo/logo-300x300.png',
  description: 'Stay connected to family and friends by sharing the LittleThings that spark joy.',
  facebookAppId: '932865370948576',
  // Default language
  language: 'en',
  envUrl: process.browser ? window.location.protocol + '//' + window.location.host : null,
  // Available locales
  locales: {
    en: {
      title: 'English',
    },
  },
  // Max number of posts to load via infinite scroll
  maxInfiniteScrollPosts: 3,
  // Number of pixels to look ahead of scroll to preload next article
  infiniteScrollLookahead: 2000,
  languageList: ['en'],
  prop30SiteName: 'littlethings',
  noSkimlinksForTheseCategorySlugs: ['pets-pet-corner'],
}

module.exports = APP_CONFIGS
