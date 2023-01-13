/**
 * Loads global configs so WSC can consume them
 */
import experimentConfig from '../statics/configs/abTest.json'
import { setConfig } from 'wsc/globalConfig'
import { setExperimentConfig } from 'wildsky-components'
import adConfig from './ads'
import './app'
import '../translations'
import { abgroupTargeting } from 'wildsky-components'

// import so we can expose to GlobalConfig
import routes from './routes'
import category_en from '../statics/configs/category_en.json'

setExperimentConfig(experimentConfig)

const abgroupValue = abgroupTargeting({ delimiter: '|' })
adConfig.globalTargeting = {
  ...adConfig.globalTargeting,
  abgroup: abgroupValue,
  vtest: abgroupValue,
}

// set global configs
setConfig('Routes', routes)
setConfig('Category', { en: category_en })
setConfig('AdConfig', adConfig)
