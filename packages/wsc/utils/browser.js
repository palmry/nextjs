const isPrerenderBot = () =>
  typeof navigator !== 'undefined' &&
  (navigator.userAgent.includes('Prerender') || navigator.userAgent.includes('prerender'))

export default isPrerenderBot
