import { getAllExperimentVariants } from './components/AbTest'

export const abgroupTargeting = (options = {}) => {
  const { delimiter = '|' } = options
  const allExperiments = getAllExperimentVariants()
  if (!allExperiments) return
  const abgroupArray = Object.keys(allExperiments).map((key, index) => {
    const variantString = key + ':' + allExperiments[key]['variant']
    return variantString
  })
  return abgroupArray.join(delimiter)
}
