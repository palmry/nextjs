import queryStrings from "./queryStrings"

export const getUtm = (key) => {
  const sessionStorageValue =
    typeof window !== "undefined" && window.sessionStorage.getItem(key)
  const utmValue = queryStrings[key]
    ? Array.isArray(queryStrings[key])
      ? queryStrings[key][0]
      : queryStrings[key]
    : null
  if (utmValue && (!sessionStorageValue || sessionStorageValue !== utmValue))
    window.sessionStorage.setItem(key, utmValue)

  return utmValue ? utmValue : sessionStorageValue
}

const referrerDomain = () => {
  const referrer =
    typeof document !== "undefined" &&
    document.referrer &&
    document.referrer !== ""
      ? document.referrer
      : null
  return referrer
    ? referrer.match(/:\/\/(.[^/]+)/)[1].replace("www.", "")
    : null
}

export const utmCampaign = (() => {
  return getUtm("utm_campaign")
})()

export const utmSource = (() => {
  const value = getUtm("utm_source")
  const referrer = referrerDomain()
  if (!value && referrer) return referrer
  return value || "(direct)"
})()

export const utmMedium = (() => {
  let value = getUtm("utm_medium")
  if (!value && referrerDomain()) return "referral"
  return value || "none"
})()

export const fbasid = (() => {
  return getUtm("fbasid")
})()

export const fbcid = (() => {
  return getUtm("fbcid")
})()

export const utmContent = (() => {
  return getUtm("utm_content")
})()

export const utmTerm = (() => {
  return getUtm("utm_term")
})()

export const utmAu5 = (() => {
  const campaign = getUtm("utm_campaign")
  const source = getUtm("utm_source")
  return campaign ? campaign : source === "keywee" ? source : "other"
})()
