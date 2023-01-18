import React from 'react'
import findKey from 'lodash/findKey'
import queryString from 'query-string'

// const queryStrings = queryString.parse(window.location.search)

const sessionStorageKey = 'abTestBuckets'

const config = {
  experiments: null,
  experimentVariants: null,
}

/**
 * Sum up the weights for an experiment
 */
const getSumOfWeights = (experiment) => {
  let sum = 0
  Object.keys(experiment.variants).forEach((variantName) => {
    sum += parseInt(experiment.variants[variantName].weight, 10)
  })
  return sum
}

const getVariantObject = (experimentName, variantName) => ({
  variant: variantName,
  metaData: config.experiments[experimentName].variants[variantName].metaData,
})

/**
 * Assigns the session to an experiment variant for each running experiment
 */
const assignBuckets = () => {
  if (config.experiments === null) {
    console.error(
      'Experiment config is not present. Be sure you call setExperimentConfig() before calling anything else'
    )
  }
  config.experimentVariants = {}

  Object.keys(config.experiments).forEach((experimentKey) => {
    const experiment = config.experiments[experimentKey]
    if (!experiment.enabled) return

    const randVal = Math.random() * getSumOfWeights(experiment)
    let sum = 0
    const variantName = findKey(experiment.variants, (variant) => {
      sum += parseInt(variant.weight, 10)
      return randVal <= sum
    })
    config.experimentVariants[experimentKey] = getVariantObject(
      experimentKey,
      variantName
    )
  })
  window.sessionStorage.setItem(
    sessionStorageKey,
    JSON.stringify(config.experimentVariants)
  )
}

/**
 * Support overriding test variants by url
 *  example: http://localhost:3000/?abtest=HelloWorldExperiment:control|Myexperiment:myVariant
 */

const applyOverrides = () => {
  const abTestParams = queryStrings.abtest
  if (!abTestParams) return
  const overrides = abTestParams.split('|')
  overrides.forEach((override) => {
    const [experimentName, variantName] = override.split(':')
    if (!experimentName || !variantName) {
      console.error('Malformed ab test override:', override)
      return
    }
    if (!(experimentName in config.experiments)) {
      console.error(
        `Experiment '${experimentName}' does not exist for override`
      )
      return
    }
    if (!(variantName in config.experiments[experimentName].variants)) {
      console.error(
        `variant '${variantName}' does not exist in experiment '${experimentName}' for override`
      )
      return
    }

    config.experimentVariants[experimentName] = getVariantObject(
      experimentName,
      variantName
    )
  })
}

export const setExperimentConfig = (exp) => {
  config.experiments = exp
  config.experimentVariants = JSON.parse(
    window.sessionStorage.getItem(sessionStorageKey)
  )
  // assign buckets if we don't have session data
  if (config.experimentVariants === null) assignBuckets()

  applyOverrides()
}

export const getAllExperimentVariants = () => config.experimentVariants

export const ifVariant = (experiment, variant) =>
  config.experimentVariants[experiment] === variant

export const useExperiment = (experiment) => {
  if (!(experiment in config.experimentVariants)) {
    console.error(
      `Experiment with name ${experiment} not found in config. 
      Please check the name against contentful. 
      You may also need to rebuild the site or on local run \`yarn run config-abtest:dev\``,
      config.experimentVariants
    )
    return () => <></>
  }
  // component for displaying children in variant
  // eslint-disable-next-line react/prop-types
  const component = ({ variant, children }) => (
    <>
      {config.experimentVariants[experiment].variant === variant && (
        <>{children}</>
      )}
    </>
  )

  // support syntax like {Experiment.helloUniverse && <h1>HELLO UNIVERSE!</h1>}
  component[config.experimentVariants[experiment].variant] = true

  // expose the variant's metadata
  component.metaData = config.experimentVariants[experiment].metaData
  return component
}

// Handy function for debugging AB tests on the page
// window.debugABTests = () => {
//   console.warn('*******AB TEST SYSTEM*********')
//   console.warn(
//     'Current tests and selected variants: ',
//     config.experimentVariants
//   )
//   console.warn('Current config:', config.experiments)
//   console.warn('******************************')
// }

// silence styleguidist's complaints
export default () => <></>
