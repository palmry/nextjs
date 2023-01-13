#! /usr/bin/env node
// environment setting
const path = require('path')
const utils = require('./utils')
const axios = require('axios')

const ROOT_PATH = path.resolve(process.cwd(), `./src/statics/configs`)
const EXPORT_FILE_NAME = 'abTest.json'
const SCRIPT_NAME = path.basename(__filename)

/**
 * get query string
 * @returns {Object<string: any>}
 */
function makeQueryString() {
  return {
    query: `
    query {
        experimentCollection {
            items {
                name
                enabled
                variantsCollection {
                  items {
                    name
                    weight
                    metadata
                  }
                }
            }
        }
    }`,
  }
}

function processConfig(data) {
  const experiments = {}
  data.experimentCollection.items.forEach(experiment => {
    const variants = {}
    experiment.variantsCollection.items.forEach(variant => {
      variants[variant.name] = {
        weight: variant.weight,
        metaData: variant.metadata,
      }
    })
    experiments[experiment.name] = {
      enabled: experiment.enabled,
      variants,
    }
  })
  return experiments
}

/**
 * main function
 */
async function main() {
  // call graphql
  try {
    const { data: responseData = {} } = await axios({
      ...utils.getFetchOptions(),
      data: makeQueryString(),
    })

    const graphqlData = responseData.data || {}
    const config = processConfig(graphqlData)

    if (Object.keys(config).length === 0) {
      console.trace(`[${SCRIPT_NAME}] `, 'No AB tests found.')
    }

    utils.writeFile(ROOT_PATH, EXPORT_FILE_NAME, JSON.stringify(config, null, 2), EXPORT_FILE_NAME)
  } catch (error) {
    console.log(error.message, error.response.data)
    console.trace(`[${SCRIPT_NAME}] `, error.stack)
  }
}

main()
