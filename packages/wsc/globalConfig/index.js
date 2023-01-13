import PropTypes from 'prop-types'
import deepmerge from 'deepmerge'
import types from './types'

export const globalConfig = {}

Object.keys(types).forEach(key => {
  globalConfig[key] = types[key].defaultObj
})

export const setConfig = (key, config) => {
  if (!(key in types)) {
    console.warn(`proptype for key ${key} cannot be found`)
  } else {
    const shape = types[key].shape
    const conf = deepmerge(globalConfig[key], config, {
      arrayMerge: (dest, source, options) => source,
    })
    Object.keys(shape).forEach(prop => PropTypes.checkPropTypes(shape, conf, 'config key', key))
    globalConfig[key] = conf
  }
}

export const getConfig = key => globalConfig[key]
