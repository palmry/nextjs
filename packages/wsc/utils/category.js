import get from 'lodash/get'
import { getConfig } from '../globalConfig'

const CATEGORY_CONFIGS = getConfig('Category')
const APP_CONFIGS = getConfig('AppConfig')

export const getCategoryTitlesFromCategorySlugs = categorySlugs => {
  const categoryTitles = []
  const languageList = get(APP_CONFIGS, 'languageList', ['en'])
  for (const language of languageList) {
    for (const categorySlug of categorySlugs) {
      const categoryTitle = get(CATEGORY_CONFIGS, `${language}.${categorySlug}.title`)
      categoryTitle && categoryTitles.push(categoryTitle)
    }
  }
  return categoryTitles
}
