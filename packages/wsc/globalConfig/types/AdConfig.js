/**
 * Defines the type of the global ad config object for validation
 */
import PropTypes from 'prop-types'
import {
  utmCampaign,
  utmSource,
  utmMedium,
  fbasid,
  fbcid,
  utmContent,
  utmTerm,
  utmAu5,
} from '../../utils/utmValues'

const shape = {
  slots: PropTypes.shape({}).isRequired,
  dfpKey: PropTypes.string.isRequired,
  au1: PropTypes.string.isRequired,
  au2: PropTypes.string.isRequired,
  au4: PropTypes.string.isRequired,
  au5: PropTypes.string.isRequired,
  isPaidTraffic: PropTypes.bool,
  globalTargeting: PropTypes.shape({}),
  bidAdjustments: PropTypes.shape({}),
  bidPriceTiers: PropTypes.array,
  bidderKeys: PropTypes.shape({}),
  globalPrebid: PropTypes.shape({}),
  globalAmazon: PropTypes.shape({
    pubId: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    timeout: PropTypes.number.isRequired,
  }).isRequired,
}

const defaultObj = {
  dfpKey: '3051',
  au1: '008_MomMe',
  au2: 'au2',
  au4: 'au4',
  au5: utmAu5,
  isPaidTraffic: utmAu5 !== 'other' ? true : false,
  failsafeTimeout: 3250,
  globalAmazon: {
    enabled: true,
    pubId: '3242',
    timeout: 3250,
  },
  globalPrebid: {
    bidderTimeout: 1500,
    priceGranularity: 'high',
    bidderSequence: 'fixed',
    useBidCache: true,
    enableSendAllBids: true,
    cache: {
      url: 'https://prebid.adnxs.com/pbc/v1/cache',
    },
    s2sConfig: {
      enabled: true,
      timeout: 1100,
      maxBids: 1,
      adapterOptions: {},
      syncUrlModifier: {},
      adapter: 'prebidServer',
      accountId: 'ce5a0cb8-6553-4fab-ae62-b26ba35301c9',
      bidders: ['appnexus', 'rubicon'],
      defaultVendor: 'appnexus',
      endpoint: 'https://prebid.adnxs.com/pbs/v1/openrtb2/auction',
      syncEndpoint: 'https://prebid.adnxs.com/pbs/v1/cookie_sync',
    },
  },
  globalTargeting: {
    free: utmAu5 !== 'other' ? '0' : '1',
    utm_campaign: utmCampaign || 'not_set',
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_content: utmContent,
    utm_term: utmTerm,
    fbasid: fbasid,
    netlify: 'true',
    fbcid: fbcid,
  },
  bidAdjustments: {
    appnexus: 0.87,
    aol: 0.92,
    rubicon: 0.95,
    ix: 0.96,
    openx: 0.97,
    pubmatic: 1.0,
    kargo: 0.95,
    trion: 0.9,
    gumgum: 0.95,
    triplelift: 0.9,
    aardvark: 1.0,
    grid: 0.87,
    medianet: 1.0,
    undertone: 0.9,
    onemobile: 0.92,
  },
  bidPriceTiers: [20.0, 50.0],
  bidderKeys: {
    standard: { adId: 'hb_adId', size: 'hb_size', cpm: 'hb_pb', bidderCode: 'hb_bidder' },
    appnexus: { adId: 'apn_adId', size: 'apn_size', cpm: 'bid_price' },
    aol: { adId: 'aol_adId', size: 'aol_size', cpm: 'aolbid' },
    onemobile: { adId: 'aol_adId', size: 'aol_size', cpm: 'aolbid' },
    grid: { adId: 'ipon_adid', size: 'ipon_size', cpm: 'ipon_cpm' },
    gumgum: { adId: 'gumgum_adId', size: 'gumgum_size', cpm: 'gumgum_cpm' },
    ix: { adId: 'ix_adId', size: 'ix_size', cpm: 'ix_cpm', dealId: 'ix_dealId' },
    kargo: { adId: 'kargo_adId', size: 'kargo_size', cpm: 'kargo_cpm' },
    medianet: { adId: 'hb_adid_medianet', size: 'hb_size_medianet', cpm: 'hb_pb_medianet' },
    openx: { adId: 'openx_adId', size: 'openx_size', cpm: 'openx_bid' },
    pubmatic: { adId: 'pubmatic_adId', size: 'pubmatic_size', cpm: 'pubmatic_cpm' },
    rubicon: { adUnitCode: 'rpfl_elemid', adId: 'rpfl_adId', size: 'rpfl_size', cpm: 'rpfl_price' },
    trion: { adId: 'trion_adId', size: 'trion_size', cpm: 'trion_cpm' },
    triplelift: {
      adId: 'triplelift_adId',
      size: 'triplelift_size',
      cpm: 'triplelift_cpm',
      dealId: 'triplelift_dealId',
    },
    undertone: { adId: 'hb_adId_undertone', size: 'hb_size_undertone', cpm: 'hb_pb_undertone' },
  },
  slots: {
    leader: {
      sizes: {
        mobile: [[320, 400]],
        tablet: [
          [728, 90],
          [1800, 600],
        ],
        desktop: [
          [728, 90],
          [970, 90],
          [1800, 600],
        ],
      },
    },
    footer: {
      sizes: {
        mobile: [
          [320, 50],
          [320, 100],
          [555, 55],
          [555, 56],
        ],
      },
    },
    inContent_slot_1: {
      sizes: {
        mobile: [
          [300, 250],
          [333, 333],
        ],
        tablet: [[300, 250]],
        desktop: [
          [300, 250],
          [728, 90],
        ],
      },
    },
    inContent_slot_2: {
      sizes: {
        mobile: [
          [300, 250],
          [333, 333],
        ],
        tablet: [[300, 250]],
        desktop: [
          [300, 250],
          [728, 90],
        ],
      },
    },
    inContent_slot_x: {
      sizes: {
        mobile: [
          [300, 250],
          [7, 7],
        ],
        tablet: [[300, 250]],
        desktop: [
          [300, 250],
          [7, 7],
          [728, 90],
        ],
      },
    },
    rightRail_slot_1: {
      sizes: {
        desktop: [
          [300, 250],
          [300, 600],
        ],
      },
    },
    rightRail_slot_2: {
      sizes: {
        desktop: [[300, 250]],
      },
    },
    rhombus: {
      sizes: {
        mobile: [[1, 1]],
        tablet: [[1, 1]],
        desktop: [[1, 1]],
      },
    },
    pmp_slot_1: {
      sizes: {
        mobile: [
          [300, 250],
          [320, 50],
        ],
        tablet: [[300, 250]],
        desktop: [
          [300, 250],
          [728, 90],
        ],
      },
      excludeAmazonBids: true,
    },
    video: {
      sizes: {
        mobile: [[400, 300]],
        tablet: [[400, 300]],
        desktop: [[400, 300]],
      },
    },
  },
  footerRefreshMS: 15000,
}

/**
 * Each type must export an object with a `shape` and a `defaultObj`
 */
export default {
  shape,
  defaultObj,
}
