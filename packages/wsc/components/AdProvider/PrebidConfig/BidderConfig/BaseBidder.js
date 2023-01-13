/* eslint-disable class-methods-use-this */

class BaseBidder {
  constructor(config) {
    this.config = config
  }

  /**
   * Returns array of bidders this processes
   * @returns {array[string]} the names of the bidder this config processes
   * @static
   */
  static bidderNames() {
    return ['']
  }

  /**
   * Processes and returns the params object.
   * Add any processing for this bidder here.
   *
   * @param {string} platform
   * @param {string} au3
   * @param {array[array[number]]} sizes
   * @param {string} adUnitPath
   * @param {object} params
   */
  processParams(platform, au3, sizes, adUnitPath, params) {
    return params
  }

  /**
   *
   * @param {string} platform
   * @param {string} au3
   * @param {array[array[number]]} sizes
   * @param {string} adUnitPath
   * @returns {array[object]} Array of config objects
   */
  getConfigs(platform, au3, sizes, adUnitPath) {
    const configs = []
    if (this.config.status !== '0' && platform in this.config.config) {
      if (au3 in this.config.config[platform]) {
        this.config.config[platform][au3].forEach(params => {
          const entry = this.processParams(platform, au3, sizes, adUnitPath, params)
          if (entry !== false) {
            configs.push({
              bidder: this.config.bidder_name,
              params,
            })
          }
        })
      }
    }
    return configs
  }
}

export default BaseBidder
