import deepcopy from 'deepcopy'
import PrebidConfig from './PrebidConfig'
import googletag from '../../googletag'
import pbjs from '../../pbjs'

// the default starting config
const baseConfig = {
  targeting: {},
  prebid: {},
  customEvents: {},
  slots: [],
  sizeMappings: {},
}

// the default slot config
const baseSlotConfig = {
  id: '',
  sizes: [],
  targeting: {},
  collapseEmptyDiv: [true, true],
  prebid: [
    {
      mediaTypes: { banner: { sizes: [] } },
      bids: [],
    },
  ],
}

const baseAUConfig = {
  dfpKey: '',
  au1: '',
  au2: '',
  au4: '',
  au5: '',
}

/**
 *
 */
class AdConfig {
  /**
   *
   * @param {*} config
   */
  constructor(config) {
    this.reset(config)
  }

  reset(config) {
    let cfg = config
    if (config === undefined) {
      cfg = {}
    }
    this.config = {
      ...deepcopy(baseConfig),
      ...cfg,
    }

    this.slotConfig = {}
    this.slotBidderConfig = {}
    this.auConfig = deepcopy(baseAUConfig)
    PrebidConfig.reset()
  }

  /**
   *
   * @param {*} auConfig Config object for creating adUnit path. Adds to keys already set
   *
   */
  addAUConfig(auConfig) {
    this.auConfig = {
      ...this.AUConfig,
      ...auConfig,
    }
  }

  getPath(au3) {
    return `${this.auConfig.dfpKey}/${this.auConfig.au1}/${this.auConfig.au2}/${au3}/${this.auConfig.au4}/${this.auConfig.au5}`
  }

  /**
   *
   * @param {object} targeting object containing global targeting keys and values.
   *  Adds to keys already set.
   */
  addGlobalTargeting(targeting) {
    this.config.targeting = {
      ...this.config.targeting,
      ...targeting,
    }
  }

  /**
   *
   * @param {object} targeting object containing global targeting keys and values.
   *  Adds to keys already set.
   *  Adds/Updates targeting directly in global googletag object
   */
  addGlobalTargetingToGpt(targeting = {}) {
    this.addGlobalTargeting(targeting)
    googletag.cmd.push(() => {
      Object.keys(targeting).forEach(key => {
        if (targeting[key]) googletag.pubads().setTargeting(key, targeting[key].toString())
      })
    })
  }

  /**
   *
   * @param {object} targeting object containing global prebid config.
   *  Adds to keys already set.
   */
  addGlobalPrebid(prebid) {
    this.config.prebid = {
      ...this.config.targeting,
      ...prebid,
    }
    pbjs.que.push(() => {
      pbjs.setConfig(this.config.prebid)
    })
  }

  hasSlot(id) {
    return id in this.slotConfig
  }

  /**
   *
   * @param {string} au3 the adUnit
   * @param {object} config slot config object.
   * Adds to keys already set.
   */
  addSlotConfig(id, config) {
    if (!(id in this.slotConfig)) {
      this.slotConfig[id] = {
        ...deepcopy(baseSlotConfig),
      }
    }
    this.slotConfig[id] = {
      ...this.slotConfig[id],
      ...config,
    }

    // set prebid sizes to match slot sizes
    this.slotConfig[id].prebid[0].mediaTypes.banner.sizes = this.slotConfig[id].sizes
  }

  removeSlotConfig(id) {
    delete this.slotConfig[id]
  }

  /**
   *
   * @param {string} au3 the adUnit
   * @param {object} targeting config object containing targeting keys and
   * values. Adds to keys already set.
   */
  addSlotTargeting(id, targeting) {
    if (!(id in this.slotConfig)) {
      this.slotConfig[id] = {
        ...deepcopy(baseSlotConfig),
      }
    }
    this.slotConfig[id].targeting = {
      ...this.slotConfig[id].targeting,
      ...targeting,
    }
  }

  /**
   * @param {string} au3 the adUnit
   * @param {string} bidder The id of the bidder 'appnexus'
   * @param {object} params config object containing config for bidder.
   */
  addBidderConfig(id, config) {
    if (!(id in this.slotConfig)) {
      this.slotConfig[id] = {
        ...deepcopy(baseSlotConfig),
      }
    }
    this.slotConfig[id].prebid[0].bids.push(config)
  }

  insertPrebidConfig(platform) {
    const localPlatform = platform === 'tablet' ? 'desktop' : platform
    Object.keys(this.slotConfig).forEach(id => {
      const config = this.slotConfig[id]
      const { au3 } = config
      const bidderConfigs = PrebidConfig.getBidderConfigs(
        localPlatform,
        au3,
        config.sizes,
        this.getPath(au3)
      )

      if (typeof config.prebid[0].bids !== 'undefined' && config.prebid[0].bids.length !== 0) {
        return
      }
      bidderConfigs.forEach(bidderConfig => {
        this.addBidderConfig(id, bidderConfig)
      })
    })
  }

  /**
   * Returns the built config for the slot
   *
   * @param {*} slotId The id of the slot
   * @returns {object} The config for the slot
   */
  getSlotConfig(slotId) {
    const slotCfg = deepcopy(this.slotConfig[slotId])
    const { au3 } = slotCfg
    // set path based on au3
    const path = this.getPath(au3)
    slotCfg.path = path
    slotCfg.id = slotId

    if (!('prebid' in slotCfg)) {
      slotCfg.prebid = [{}]
    }
    return slotCfg
  }

  getBuiltSlotConfig(slotId, platform, skipPrebidConfig) {
    if (!skipPrebidConfig) this.insertPrebidConfig(platform || 'desktop')
    return this.getSlotConfig(slotId)
  }

  /**
   * @returns {object} react-prebid config object
   */
  getConfig(platform, skipPrebidConfig) {
    const slots = []

    if (!skipPrebidConfig) this.insertPrebidConfig(platform || 'desktop')
    // build slots array from slotConfig object
    Object.keys(this.slotConfig).forEach(id => {
      const slotCfg = this.getSlotConfig(id)

      slots.push(slotCfg)
    })
    return {
      ...this.config,
      slots,
    }
  }
}

export default new AdConfig()
