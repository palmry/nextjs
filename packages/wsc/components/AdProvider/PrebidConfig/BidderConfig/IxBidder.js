import BaseBidder from './BaseBidder'

class IxBidder extends BaseBidder {
  static bidderNames() {
    return ['ix']
  }

  // eslint-disable-next-line class-methods-use-this
  processParams(platform, au3, sizes, adUnitPath, params) {
    const newParams = params
    if (typeof newParams.size === 'string') {
      newParams.size = newParams.size.split(',').map(str => parseInt(str, 10))
    } else if (Array.isArray(newParams.size)) {
      newParams.size = newParams.size.map(str => parseInt(str, 10))
    }
    return newParams
  }
}

export default IxBidder
