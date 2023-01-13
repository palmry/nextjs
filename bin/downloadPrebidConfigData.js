#! /usr/bin/env node
/**
 * Downloads prebid config and creates a package called 'prebid-config-data' in node_modules
 * usage: npx download-prebid-config [site] ['dev'|'prod']
 */

var axios = require('axios')
var fs = require('fs')

var site = process.argv[2]
var isDev = process.argv[3] === 'dev'

var packagePath = 'node_modules/prebid-config-data'
var packageFile = 'prebid-config-data-package.json'

if (!site) {
  console.log('Site not provided. Please provide a site as the first argument.')
  process.exit()
}

console.log('Downloading prebid config...')
var url = 'http://prebid-config.cafemom.com/data?allow=true&site='

if (isDev) {
  url = 'http://prebid-config.jordanw.dev.cafemom.com/data?allow=true&site='
}

url += site

axios
  .get(url)
  .then(function(response) {
    console.log('Done. Creating node package...')
    try {
      if (!fs.existsSync(packagePath)) {
        fs.mkdirSync(packagePath)
      }

      fs.writeFileSync(
        packagePath + '/index.js',
        'module.exports = ' + JSON.stringify(response.data.data) + ';'
      )

      var packageJson = ''
      if (fs.existsSync('bin/' + packageFile)) {
        packageJson = fs.readFileSync('bin/' + packageFile)
      } else {
        var pkgConfigPath = 'node_modules/wildsky-components/bin/' + packageFile
        // handle yarn workspace configurations
        if (!fs.existsSync(pkgConfigPath)) {
          pkgConfigPath = '../../' + pkgConfigPath
        }
        packageJson = fs.readFileSync(pkgConfigPath)
      }
      fs.writeFileSync(packagePath + '/package.json', packageJson)

      console.log('Successfully created package.')
    } catch (e) {
      console.log('Error creating prebid-config node packge in node_modules: ', e)
    }
  })
  .catch(function(error) {
    console.log('error making request to ' + url)
    if (isDev) console.log('Are you connected to VPN?')
    console.log(error.message)
  })
