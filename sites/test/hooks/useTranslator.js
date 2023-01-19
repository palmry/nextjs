import { useContext } from 'react'
import dateformat from 'dateformat'
import get from 'lodash/get'
import { LocaleStateContext } from '../components/context/LocaleProvider'

import en from '../translations/en.json'

import NAVBAR_CONFIGS_EN from '../statics/configs/navbar_en.json'

import CATEGORY_CONFIGS_EN from '../statics/configs/category_en.json'

import SUBCATEGORY_CONFIGS_EN from '../statics/configs/subcategories_en.json'

const TRANSLATIONS = {
  en: en,
}

const MONTH_NAME_SET = {
  en: en.global.monthNames.concat(dateformat.i18n.monthNames.slice(12, 24)),
}

const NAVBAR_CONFIGS_SET = {
  en: NAVBAR_CONFIGS_EN,
}

const CATEGORY_CONFIGS = {
  en: CATEGORY_CONFIGS_EN,
}

const SUBCATEGORY_CONFIGS = {
  en: SUBCATEGORY_CONFIGS_EN,
}

const useTranslator = () => {
  const { locale, setLocale } = () => useContext(LocaleStateContext)

  const translator = (key) => {
    let translated = get(TRANSLATIONS, locale + '.' + key, key)
    if (translated === key) {
      // fallback function
      console.error(key + ': Invalid key')
      return key
    }
    return translated
  }

  const getPostDateTitle = (publishedDate, updatedDate) => {
    if (!publishedDate) return ''
    let updatedAtTitle
    dateformat.i18n.monthNames = MONTH_NAME_SET[locale]
    updatedAtTitle = dateformat(
      new Date(updatedDate || publishedDate),
      `mmm d, yyyy`
    )
    return `${
      updatedDate
        ? TRANSLATIONS[locale].global.update
        : TRANSLATIONS[locale].global.publish
    } ${updatedAtTitle}`
  }

  const getNavbarConfig = () => {
    return NAVBAR_CONFIGS_SET[locale]
  }

  const getCategoryConfig = (slug) => {
    return CATEGORY_CONFIGS[locale][slug]
  }

  const getSubcategoryConfig = (sys) => {
    return SUBCATEGORY_CONFIGS[locale][sys]
  }

  return {
    locale,
    setLocale,
    translator,
    getPostDateTitle,
    getNavbarConfig,
    getCategoryConfig,
    getSubcategoryConfig,
  }
}

export { useTranslator }
