export function fbPixelInit() {
  const facebookPixels = process.env.REACT_APP_FACEBOOK_PIXEL_ID.split(',')
  if (window.fbq) {
    facebookPixels.map(id => window.fbq('init', id.trim()))
    window.fbq.disablePushState = true // Disables sending PageView events on history state change
  }
}

// Keywee tracker also uses a facebook pixel and it was intercepting our PageView call
//  so need to specify our own id for the events we are sending

export function fbSendGenericEvent() {
  const facebookPixels = process.env.REACT_APP_FACEBOOK_PIXEL_ID.split(',')
  if (window.fbq) {
    facebookPixels.map(id => window.fbq('trackSingle', id.trim(), 'PageView'))
    facebookPixels.map(id => window.fbq('trackSingle', id.trim(), 'ViewContent'))
  }
}

export function fbSendEvent(event) {
  const facebookPixels = process.env.REACT_APP_FACEBOOK_PIXEL_ID.split(',')
  if (window.fbq) {
    facebookPixels.map(id => window.fbq('trackSingle', id.trim(), event))
  }
}

export function fbSendCustomEvent(event) {
  const facebookPixels = process.env.REACT_APP_FACEBOOK_PIXEL_ID.split(',')
  facebookPixels.map(id => window.fbq('trackSingleCustom', id.trim(), event))
}
