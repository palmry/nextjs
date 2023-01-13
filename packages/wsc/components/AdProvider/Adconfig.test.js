import AdConfig from './AdConfig'

beforeEach(() => {
  AdConfig.reset()
})

test('AdConfig exists', () => {
  expect(AdConfig).toBeDefined()
})

test('au3 and getPath', () => {
  expect(() => {
    AdConfig.addAUConfig({
      dfpKey: 'key',
      au1: 'au1',
      au2: 'au2',
      au4: 'au4',
      au5: 'au5',
    })
  }).not.toThrow()

  let path = null
  expect(() => {
    path = AdConfig.getPath('au3')
  }).not.toThrow()
  expect(path).toEqual('key/au1/au2/au3/au4/au5')
})

test('getConfig returns a config', () => {
  expect(AdConfig.getConfig()).toMatchObject({
    targeting: {},
    prebid: {},
    customEvents: {},
    slots: [],
    sizeMappings: {},
  })
})

test('setGlobalTargetting', () => {
  AdConfig.addGlobalTargeting({
    foo: 'bar',
  })
  expect(AdConfig.getConfig()).toMatchObject({
    targeting: { foo: 'bar' },
  })

  AdConfig.addGlobalTargeting({
    foo: 'biz',
  })
  expect(AdConfig.getConfig()).toMatchObject({
    targeting: { foo: 'biz' },
  })

  AdConfig.addGlobalTargeting({
    cool: 'baz',
  })
  expect(AdConfig.getConfig()).toMatchObject({
    targeting: { foo: 'biz', cool: 'baz' },
  })
})

test('addSlotConfig', () => {
  const au3 = 'foo'
  const id = 'slotId'

  expect(AdConfig.getConfig()).toMatchObject({
    slots: [],
  })

  AdConfig.addSlotConfig(id, {})
  expect(AdConfig.getConfig()).toMatchObject({
    slots: [
      {
        path: '///undefined//',
      },
    ],
  })

  AdConfig.addSlotConfig(id, {
    au3,
    targeting: { key: 'value' },
  })
  expect(AdConfig.getConfig()).toMatchObject({
    slots: [
      {
        path: '///foo//',
        targeting: { key: 'value' },
      },
    ],
  })

  AdConfig.addSlotConfig(id, {
    sizes: [[100, 100]],
  })
  expect(AdConfig.getConfig()).toMatchObject({
    slots: [
      {
        path: '///foo//',
        targeting: { key: 'value' },
        sizes: [[100, 100]],
      },
    ],
  })
})

test('addSlotTargeting', () => {
  const au3 = 'foo'
  const id = 'id'
  AdConfig.addSlotTargeting(id, {})
  expect(AdConfig.getConfig()).toMatchObject({
    slots: [
      {
        path: '///undefined//',
      },
    ],
  })

  AdConfig.addSlotTargeting(id, {
    dcs: 1,
    foo: 'bar',
  })
  expect(AdConfig.getConfig()).toMatchObject({
    slots: [
      {
        path: '///undefined//',
        targeting: { dcs: 1, foo: 'bar' },
      },
    ],
  })
})
/*
test('addBidderParams works', () => {
  const au3 = 'foo';
  const bidder = 'appnexus';
  AdConfig.addBidderParams(au3, bidder, { foo: 'bar' });
  expect(AdConfig.getConfig()).toMatchObject({
    slots: [
      {
        prebid: [
          {
            bids: [
              {
                bidder,
                params: {
                  foo: 'bar',
                },
              },
            ],
          },
        ],
      },
    ],
  });

  AdConfig.addBidderParams(au3, bidder, { goo: 'biz', do: 2.1 });
  expect(AdConfig.getConfig()).toMatchObject({
    slots: [
      {
        prebid: [
          {
            bids: [
              {
                bidder,
                params: {
                  foo: 'bar',
                  goo: 'biz',
                  do: 2.1,
                },
              },
            ],
          },
        ],
      },
    ],
  });
});
*/
