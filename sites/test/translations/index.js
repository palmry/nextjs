import en from './en.json'
import { setConfig, getConfig } from 'wsc/globalConfig'

const translations = {
  en,
}

setConfig('Translations', translations)
export default getConfig('Translations')
