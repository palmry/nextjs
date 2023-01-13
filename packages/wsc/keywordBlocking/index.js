// eslint-disable-next-line import/no-extraneous-dependencies
import keywordLists from 'keyword-block-config-data'
import escapeRegExp from 'lodash/escapeRegExp'

const results = {}
const getBlockedLists = content => {
  const contentLower = content.toLowerCase()

  if (results[contentLower]) return results[contentLower]

  const lists = []
  Object.keys(keywordLists).forEach(listName => {
    const list = keywordLists[listName]

    list.find(keyword => {
      if (!keyword) return false
      if (contentLower.includes(keyword)) {
        if (new RegExp(`\\b${escapeRegExp(keyword)}\\b`).test(contentLower)) {
          lists.push(listName)
          return true
        }
      }
      return false
    })
  })
  results[contentLower] = lists
  return lists
}

export default {
  getBlockedLists,
}
