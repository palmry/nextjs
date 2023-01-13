import PrebidConfig from '.'
import BaseBidder from './BidderConfig/BaseBidder'

const config = {
  site: 'cafemom',
  bidder: 'aol',
  bidder_name: 'aol',
  status: '1',
  config: {
    desktop: {
      leader: [
        {
          placement: '3671850',
          alias: '728',
          network: '10126.1',
        },
      ],
      alpha: [
        {
          placement: '3676115',
          alias: '300a1',
          network: '10126.1',
        },
        {
          placement: '4002852',
          alias: 'alpha_desktop_300x600',
          network: '10126.1',
        },
        {
          placement: '4002849',
          alias: 'alpha_desktop_300x1050',
          network: '10126.1',
        },
      ],
    },
  },
}
test('PrebidConfig exists', () => {
  expect(PrebidConfig).toBeDefined()
})

test('prebid config data exists', () => {
  expect(PrebidConfig.getPrebidConfigData()).not.toBeFalsy()
})

test('simple getBidderObject()', () => {
  let obj = null
  expect(() => {
    obj = PrebidConfig.getBidderObject(config)
  }).not.toThrow()
  expect(obj).not.toBeFalsy()
})

test('getBidderObject() with custom bidder object', () => {
  let obj = null
  class MyBidder extends BaseBidder {
    static bidderNames() {
      return ['aol']
    }
  }

  PrebidConfig.addBidderClass(MyBidder)
  expect(() => {
    obj = PrebidConfig.getBidderObject(config)
  }).not.toThrow()
  expect(obj).not.toBeFalsy()
  expect(obj).toBeInstanceOf(MyBidder)

  class MyBidder2 extends MyBidder {}
  PrebidConfig.addBidderClass(MyBidder2)

  expect(() => {
    obj = PrebidConfig.getBidderObject(config)
  }).not.toThrow()
  expect(obj).not.toBeFalsy()
  expect(obj).toBeInstanceOf(MyBidder2)
})

test('simple getBidderConfigs()', () => {
  let bidderConfigs = null
  expect(() => {
    bidderConfigs = PrebidConfig.getBidderConfigs('desktop', 'leader')
  }).not.toThrow()
  expect(bidderConfigs).not.toBeFalsy()
})
