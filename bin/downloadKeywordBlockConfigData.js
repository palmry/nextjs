#! /usr/bin/env node
/**
 * Downloads prebid config and creates a package called 'prebid-config-data' in node_modules
 * usage: npx download-prebid-config [site] ['dev'|'prod']
 */

var axios = require('axios')
var fs = require('fs')

var packagePath = 'node_modules/keyword-block-config-data'

console.log('Downloading keyword blocking config...')
var url = 'https://prebid-config.cafemom.com/keyword/full'
var packageFile = 'keyword-block-config-data-package.json'

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
        'module.exports = ' + JSON.stringify(response.data) + ';'
      )

      var packageJson = ''
      if (fs.existsSync('bin/' + packageFile)) {
        packageJson = fs.readFileSync('bin/' + packageFile)
      } else {
        var pkgConfigPath = 'node_modules/wildsky-components/bin/'
        // handle yarn workspace configurations
        if (!fs.existsSync(pkgConfigPath)) {
          pkgConfigPath = '../../' + pkgConfigPath
        }
        packageJson = fs.readFileSync(pkgConfigPath + packageFile)
      }
      fs.writeFileSync(packagePath + '/package.json', packageJson)

      console.log('Successfully created package.')
    } catch (e) {
      console.log('Error creating keyword-block-config-data node packge in node_modules: ', e)
    }
  })
  .catch(function(error) {
    console.log('error making request to ' + url)
    if (isDev) console.log('Are you connected to VPN?')
    console.log(error.message)
  })
