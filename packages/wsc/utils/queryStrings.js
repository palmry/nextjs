import queryString from "query-string"

const queryStrings = () => {
  return queryString.parse(
    typeof window !== "undefined" && window.location.search
  )
}

export const queryStringsBoolean = (query) => {
  return queryString.parse(window.location.search, { parseBooleans: true })[
    query
  ]
}

export default queryStrings()
