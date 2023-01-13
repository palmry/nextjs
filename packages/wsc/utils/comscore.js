import axios from 'axios'
import { getActiveSubCategory } from './activeCategory'
export function addComscore(options) {
  if (process.env.REACT_APP_DEFAULT_CONTENT_SOURCE === 'littlethings') {
    const { catString } = options
    let isFamilyAndParenting =
      catString === 'family-and-parenting' ||
      getActiveSubCategory().includes('Family Pets') ||
      getActiveSubCategory().includes('Trending Parenting News')

    window._comscore = window._comscore || []
    let comscoreObj = {
      c1: '2',
      c2: '30177769',
      options: isFamilyAndParenting
        ? {
            url_append: 'comscorekw=Parenting',
          }
        : {},
    }
    window._comscore.push(comscoreObj)
    ;(function() {
      var s = document.createElement('script'),
        el = document.getElementsByTagName('script')[0]
      s.async = true
      s.src =
        (document.location.protocol === 'https:' ? 'https://sb' : 'http://b') +
        '.scorecardresearch.com/beacon.js'
      el.parentNode.insertBefore(s, el)
    })()
  }
  axios.get(`/track_comscore.xml`, { headers: { 'Cache-Control': 'no-cache' } })
}
