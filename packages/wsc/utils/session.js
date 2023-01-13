import uuid4 from 'uuid/v4'

const sessionIdKey = 'phpsessid'

export const getSessionId = () => {
  let sessionId = window.sessionStorage.getItem(sessionIdKey)
  if (!sessionId) {
    sessionId = uuid4()
    window.sessionStorage.setItem(sessionIdKey, sessionId)
  }
  return sessionId
}
