// import AdConfig from '../components/AdProvider/AdConfig'

export const getFpv = () => {
  let fpv = window.sessionStorage.getItem("fpv") || 0
  return parseInt(fpv)
}
export const incrementFpv = () => {
  window.sessionStorage.setItem("fpv", getFpv() + 1)
  // AdConfig.addGlobalTargetingToGpt({ fpv: getFpv() })
}
