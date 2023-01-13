import BaseBidder from './BaseBidder'

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
      apple: [
        {
          placement: '3671851',
          alias: '300a',
          network: '10126.1',
        },
      ],
      bravo: [
        {
          placement: '3891133',
          alias: '300b',
          network: '10126.1',
        },
      ],
      berry: [
        {
          placement: '4145256',
          alias: 'berry_desktop_300x250',
          network: '10126.1',
        },
      ],
      charlie: [
        {
          placement: '3891134',
          alias: '300c',
          network: '10126.1',
        },
        {
          placement: '4002854',
          alias: 'charlie_desktop_300x600',
          network: '10126.1',
        },
      ],
      sky: [
        {
          placement: '3671849',
          alias: '160',
          network: '10126.1',
        },
      ],
    },
    mobile: {
      leader: [
        {
          placement: '3896983',
          alias: '300x50',
          network: '10126.1',
        },
        {
          placement: '3671852',
          alias: '320',
          network: '10126.1',
        },
      ],
      apple: [
        {
          placement: '3671848',
          alias: '300m',
          network: '10126.1',
        },
      ],
      bravo: [
        {
          placement: '3891135',
          alias: '300mb',
          network: '10126.1',
        },
        {
          placement: '3891139',
          alias: '320b',
          network: '10126.1',
        },
        {
          placement: '3891138',
          alias: '300x50b',
          network: '10126.1',
        },
      ],
      berry: [
        {
          placement: '4145257',
          alias: 'berry_mobile_300x250',
          network: '10126.1',
        },
        {
          placement: '4145258',
          alias: 'berry_mobile_320x50',
          network: '10126.1',
        },
        {
          placement: '4145259',
          alias: 'berry_mobile_300x50',
          network: '10126.1',
        },
      ],
      charlie: [
        {
          placement: '3891137',
          alias: '300mc',
          network: '10126.1',
        },
        {
          placement: '3891140',
          alias: '320c',
          network: '10126.1',
        },
      ],
    },
  },
  modified_user: 'Admin User',
  modified_datetime: '2019-06-13 17:51:21',
}

test('BaseBidder constructor works', () => {
  let bidder = null
  expect(() => {
    bidder = new BaseBidder(config)
  }).not.toThrow()
  expect(bidder).not.toBeNull()
})

test('processParams()', () => {
  const bidder = new BaseBidder(config)

  let params = null
  expect(() => {
    params = bidder.processParams('desktop', 'leader', null, null, { foo: 'bar' })
  }).not.toThrow()
  expect(params).toMatchObject({ foo: 'bar' })
})

test('getConfigs() simple', () => {
  const bidder = new BaseBidder(config)
  let configs = null
  expect(() => {
    configs = bidder.getConfigs('desktop', 'leader')
  }).not.toThrow()
  expect(configs).toMatchObject([
    { bidder: 'aol', params: { placement: '3671850', alias: '728', network: '10126.1' } },
  ])
})

test('getConfigs() multiple results', () => {
  const bidder = new BaseBidder(config)
  let configs = null
  expect(() => {
    configs = bidder.getConfigs('desktop', 'alpha')
  }).not.toThrow()
  expect(configs).toMatchObject([
    {
      bidder: 'aol',
      params: { placement: '3676115', alias: '300a1', network: '10126.1' },
    },
    {
      bidder: 'aol',
      params: { placement: '4002852', alias: 'alpha_desktop_300x600', network: '10126.1' },
    },
    {
      bidder: 'aol',
      params: { placement: '4002849', alias: 'alpha_desktop_300x1050', network: '10126.1' },
    },
  ])
})
