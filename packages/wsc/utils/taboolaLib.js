import get from 'lodash/get'
import { sleep } from 'wsc/utils/common'

const firstPageviewList = []

/**
 * Get the account ID which is defined on GTM.
 */
export function getCurrentAccountId() {
  return get(window, 'taboolaAccountId', 0)
}

/**
 * Check the snippet code has been loaded by GTM
 */
export function isLoaded() {
  return window._tfa !== undefined
}

/**
 * Send a pageview event based on this ticket.
 * https://jira.yk.wildskymedia.com/browse/MOMCOM-655
 */
export async function sendPageviewEvent() {
  while (!isLoaded()) {
    await sleep(100)
  }
  const currentAccountId = getCurrentAccountId()
  if (firstPageviewList.indexOf(currentAccountId) === -1) {
    firstPageviewList.push(currentAccountId)
    sendEvent({
      notify: 'event',
      name: 'page_view',
      id: currentAccountId,
    })
  }
}

/**
 * Send a view content event based on this ticket.
 * https://jira.yk.wildskymedia.com/browse/MOMCOM-655
 */
export async function sendViewContentEvent() {
  while (!isLoaded()) {
    await sleep(100)
  }
  sendEvent({
    notify: 'event',
    name: 'view_content',
    id: getCurrentAccountId(),
  })
}

/**
 * Send a generic event.
 * @param {Object} payload
 */
export async function sendEvent(payload) {
  while (!isLoaded()) {
    await sleep(100)
  }
  window._tfa.push(payload)
}

/**
 * Change settings by locale.
 * @param {String} locale
 */
export async function changeSettingsByLocale(locale) {
  while (!isLoaded()) {
    await sleep(100)
  }
  window.changeTaboolaAccountIdByLanguage(locale)
  window.loadTaboolaConfig()
  window.updateTaboolaPageviewSrc()
  window.updateTaboolaViewContextSrc()
  sendPageviewEvent()
  sendViewContentEvent()
}
