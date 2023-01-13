/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import AdConfig from './AdConfig'
import PrebidConfig from './PrebidConfig'
import AdProviderContext from './AdProviderContext'
import isPrerenderBot from '../../utils/browser'
import { sendGaEvent } from '../../utils/googleTagManager'
import googletag from '../../googletag'
import executeAuction from '../../adAuction'
import '../../apstag'
import { getConfig } from '../../globalConfig'

window.googletag = window.googletag || { cmd: [] }

const getAdImpressionCount = () => {
  let adImpressionCount = window.sessionStorage.getItem('adImpressionCount') || 0
  return parseInt(adImpressionCount)
}
const incrementAdImpressionCount = () => {
  window.sessionStorage.setItem('adImpressionCount', getAdImpressionCount() + 1)
}

// Need to get slots from gpt since AdvertiserProvider doesn't expose them
window.googletag.cmd.push(() => {
  window.googletag.pubads().addEventListener('slotRequested', event => {
    const { slot } = event
    if (!('gptSlots' in window)) {
      window.gptSlots = {}
    }
    window.gptSlots[slot.getSlotElementId()] = slot
  })
  window.googletag.pubads().addEventListener('slotRenderEnded', event => {
    const adUnitPath = event.slot.getAdUnitPath()
    const { isEmpty } = event

    if (!isEmpty && !adUnitPath.includes('rhombus')) {
      incrementAdImpressionCount()
      sendGaEvent({ eventName: 'adImpression' })
      if (getAdImpressionCount() === 10) {
        sendGaEvent({ eventName: 'adImpression10' })
      }
    }
    if (event.slot.callback) event.slot.callback(event)
  })
})

const AdProvider = props => {
  // eslint-disable-next-line prefer-const
  let [config, setConfig] = useState(null)
  let [slotIdMap, setSlotIdMap] = useState(null)
  const {
    slots,
    debug,
    bidderClasses,
    platform,
    globalTargeting,
    children,
    slotList,
    reset,
  } = props
  let globalConfig = getConfig('AdConfig')

  const lastResetVal = useRef(null)

  if (lastResetVal.current !== reset && config !== null) {
    if (debug) console.log('Doing global reset')
    config = null
  }
  lastResetVal.current = reset

  const getSlotConfig = (au3, slotCount) => ({
    id: `div-gpt-ad-${au3}${slotCount ? `_${slotCount}` : ''}`,
    au3,
    sizes: globalConfig.slots[au3].sizes[platform],
  })

  const processSlotList = () => {
    const slotMap = {}
    if (!globalConfig) {
      console.warn('AdProvider: Slotlist requires global config, but global config not privided')
      return {}
    }

    slotList.forEach(slot => {
      if (Array.isArray(slot)) {
        // eslint-disable-next-line prefer-const
        let [au3, cfg, number] = slot
        if (!number) number = 1
        if (!cfg) cfg = {}
        if (number > 1) slotMap[au3] = []
        for (let i = 0; i < number; i++) {
          const slotConfig = getSlotConfig(au3, i)
          AdConfig.addSlotConfig(slotConfig.id, { ...slotConfig, ...cfg })
          AdConfig.addSlotTargeting(slotConfig.id, { au3 })
          if (number > 1) slotMap[au3].push(slotConfig.id)
          else slotMap[au3] = slotConfig.id
        }
      } else {
        const slotConfig = getSlotConfig(slot, null)
        AdConfig.addSlotConfig(slotConfig.id, slotConfig)
        AdConfig.addSlotTargeting(slotConfig.id, { au3: slot })
        slotMap[slot] = slotConfig.id
      }
    })
    return slotMap
  }

  if (config === null) {
    AdConfig.reset()
    window.gptSlots = {}
    setSlotIdMap(null)
    slotIdMap = null

    // add au config to AdConfig
    const auConfig = {}

    if (globalConfig === null) {
      globalConfig = {}
    }

    // get au from globalConfig
    if (globalConfig) {
      ;['dfpKey', 'au1', 'au2', 'au4', 'au5'].forEach(key => {
        if (key in globalConfig) {
          auConfig[key] = globalConfig[key]
        }
      })
    }
    // au props overwite global config
    ;['dfpKey', 'au1', 'au2', 'au4', 'au5'].forEach(key => {
      if (key in props && props[key] !== null) {
        auConfig[key] = props[key]
      }
    })
    AdConfig.addAUConfig(auConfig)

    // add slot configs
    if (slots) {
      Object.keys(slots).forEach(id => {
        AdConfig.addSlotConfig(id, slots[id])
      })
    }

    // add custom bidder classes
    if (Array.isArray(bidderClasses)) {
      bidderClasses.forEach(bidderClass => PrebidConfig.addBidderClass(bidderClass))
    }

    if (globalTargeting) {
      AdConfig.addGlobalTargetingToGpt(globalTargeting)
    }

    if ('globalTargeting' in globalConfig) {
      AdConfig.addGlobalTargetingToGpt(globalConfig.globalTargeting)
    }

    if ('globalPrebid' in globalConfig) {
      AdConfig.addGlobalPrebid(globalConfig.globalPrebid)
    }

    if (Array.isArray(slotList) && slotIdMap === null) {
      setSlotIdMap(processSlotList(slotList, globalConfig, platform))
    }

    // enable google publisher tag services
    googletag.cmd.push(() => {
      googletag.enableServices()
    })

    // initialize amazon if setup
    if ('globalAmazon' in globalConfig && globalConfig.globalAmazon.enabled) {
      window.apstag.init({
        pubID: globalConfig.globalAmazon.pubId,
        adServer: 'googletag',
        deals: true,
      })
    }

    // eslint-disable-next-line react/destructuring-assignment
    setConfig('configOverride' in props ? props.configOverride : AdConfig.getConfig(platform))
  }

  if (debug) console.log('AdProvider using config:', config)

  const refreshSlot = slotId => {
    const [slot] = config.slots.filter(s => s.id === slotId)
    if (!slot) {
      console.warn(`Cannot find slot with id ${slotId} to refresh`)
      return
    }
    if (!(slotId in window.gptSlots)) {
      console.warn(`Cannot find slot with id ${slotId} from GPT to refresh`)
      return
    }
    executeAuction({
      ids: [slotId],
      slots: [window.gptSlots[slot.id]],
      globalConfig,
    })
  }

  const refreshAll = () => {
    setConfig(AdConfig.getConfig(platform))
  }

  return (
    <>
      <AdProviderContext.Provider
        value={{
          refreshAll,
          refreshSlot,
          config,
          setConfig,
          globalConfig,
          slotIdMap,
          getSlotConfig,
          debug,
          platform,
          enabled: !isPrerenderBot(),
        }}
      >
        {children}
      </AdProviderContext.Provider>
    </>
  )
}

AdProvider.defaultProps = {
  bidderClasses: null,
  debug: false,
  globalTargeting: null,
  slots: null,

  au1: null,
  au2: null,
  au4: null,
  au5: null,
  dfpKey: null,
  slotList: null,
}

AdProvider.propTypes = {
  au1: PropTypes.string,
  au2: PropTypes.string,
  au4: PropTypes.string,
  au5: PropTypes.string,
  bidderClasses: PropTypes.arrayOf(PropTypes.func),
  debug: PropTypes.bool,
  dfpKey: PropTypes.string,
  globalTargeting: PropTypes.shape({}),
  platform: PropTypes.oneOf(['desktop', 'tablet', 'mobile']).isRequired,
  slots: PropTypes.shape({}),

  slotList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])),
}

export default AdProvider
