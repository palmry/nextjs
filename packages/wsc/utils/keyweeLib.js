import { oneTrustUserConsent } from 'wsc/utils/oneTrustLib'

const KEYWEE_ID = process.env.REACT_APP_KEYWEE_ID

/**
 * Initial Keywee
 */
export function initialize() {
  if (oneTrustUserConsent.isAccepted() && window.kwa) {
    // It will automatically send a page view event when we call this method.
    window.kwa('initialize', parseInt(KEYWEE_ID))
  }
}

/**
 * Send Page View
 */
export function sendPageView() {
  if (oneTrustUserConsent.isAccepted() && window.kwa) {
    window.kwa('sendPageView')
  }
}
