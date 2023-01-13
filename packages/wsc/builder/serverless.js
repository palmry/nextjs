const path = require('path')
const fs = require('fs')
const { get } = require('lodash')

// create static file in lambda folder
const ROOT_PATH = path.resolve(process.cwd(), `./lambda`)
const EXPORT_FILE_NAME = 'environment.json'
const BASE_DIR = path.resolve(process.cwd())

const context = get(process.env, 'CONTEXT', 'development')
const targetConfigFile =
  context !== 'production' ? 'lambda-development.json' : 'lambda-production.json'
console.log('Serverless Environment:', context)

fs.copyFileSync(BASE_DIR + '/' + targetConfigFile, ROOT_PATH + '/' + EXPORT_FILE_NAME)

// create static file in wsc/lambda/configs folder
const WSC_ROOT_PATH = path.resolve(process.cwd(), `../../common/wildsky-components/lambda/configs`)
fs.mkdirSync(WSC_ROOT_PATH, { recursive: true })

fs.copyFileSync(BASE_DIR + '/' + targetConfigFile, WSC_ROOT_PATH + '/' + EXPORT_FILE_NAME)

fs.copyFileSync(BASE_DIR + '/src/configs/appRaw.js', WSC_ROOT_PATH + '/appRaw.js')

try {
  fs.copyFileSync(
    BASE_DIR + '/src/statics/configs/category_en.json',
    WSC_ROOT_PATH + '/category.json'
  )
} catch (error) {
  if ('code' in error && error.code === 'ENOENT') {
    fs.copyFileSync(
      BASE_DIR + '/src/statics/configs/category.json',
      WSC_ROOT_PATH + '/category.json'
    )
  } else {
    console.error('Cannot copy category file to wsc/lambda/config')
  }
}

try {
  fs.copyFileSync(
    BASE_DIR + '/src/statics/configs/subcategories_en.json',
    WSC_ROOT_PATH + '/subcategories.json'
  )
} catch (error) {
  if ('code' in error && error.code === 'ENOENT') {
    fs.copyFileSync(
      BASE_DIR + '/src/statics/configs/subcategories.json',
      WSC_ROOT_PATH + '/subcategories.json'
    )
  } else {
    console.error('Cannot copy subcategories file to wsc/lambda/config')
  }
}

try {
  fs.copyFileSync(BASE_DIR + '/src/statics/configs/series.json', WSC_ROOT_PATH + '/series.json')
} catch (error) {
  console.error('Cannot copy series file to wsc/lambda/config')
}
