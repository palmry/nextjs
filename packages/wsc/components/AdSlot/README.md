# AdSlot Component

An `AdSlot` represents the ad slot on the page.

## Usage:

The `AdSlot` must be the child of an `AdProvider` component, and the `AdSlot` must have an
`id` prop that matches an `id` in the parent `AdProvider`'s slot config.

```jsx
import { AdProvider, AdSlot, BaseBidder } from '../../index'
import { setConfig } from '../../globalConfig'
setConfig('AdConfig', {})
window.googletag = googletag || {}
window.googletag.cmd = googletag.cmd || []
window.pbjs = window.pbjs || {}
window.pbjs.que = window.pbjs.que || []
React.useEffect(() => {
  let script = document.createElement('script')
  script.src = 'https://www.googletagservices.com/tag/js/gpt.js'
  script.async = true
  document.body.appendChild(script)

  script = document.createElement('script')
  script.src = 'https://acdn.adnxs.com/prebid/not-for-prod/1/prebid.js'
  script.async = true
  document.body.appendChild(script)

  window.pbjs.que.push(() => window.pbjs.setConfig({ debug: true }))
}, [])
;<>
  <AdProvider debug platform="tablet" slotList={['inContent_slot_x']}>
    <AdSlot au3="inContent_slot_x" />
    <AdSlot au3="inContent_slot_x" number={1} teardown={false} appendId={'_foo'} />
  </AdProvider>
</>
```
