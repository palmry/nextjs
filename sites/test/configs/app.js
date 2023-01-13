import APP_CONFIGS from './appRaw'
import { setConfig, getConfig } from 'wsc/globalConfig'

setConfig('AppConfig', APP_CONFIGS)
export default getConfig('AppConfig')
