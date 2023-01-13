const path = require('path')
const get = require('lodash/get')
const languages = ['en', 'es']

const TRANSLATIONS = languages.reduce((translateList, lang) => {
  const textPath = `./src/translations/${lang}.json`
  try {
    translateList[lang] = require(path.resolve(process.cwd(), textPath))
  } catch {
    console.log('Could not load translated text at ' + textPath)
  }
  return translateList
}, {})

const CONTENTFUL_POST_LOCALE_KEYWORDS = {
  en: 'English',
  es: 'Spanish',
}

function getText(path) {
  return get(TRANSLATIONS, path, '')
}

module.exports = { getText, CONTENTFUL_POST_LOCALE_KEYWORDS }
