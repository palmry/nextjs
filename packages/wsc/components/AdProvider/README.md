# AdProvider Component

Component that provides ad configuration to `AdSlot` components.

## Example Usage

To show an ad using prebid config:

```javascript static
import React from "react"

const App = () => {
  const slots = {
    leader: {
      id: "div-gpt-ad-2321321-2",
      sizes: [[300, 250], [300, 600]],
      targeting: {
        tile: 1
      }
    }
  }

  // create special bidder for handling indexExchange
  class myBidder extends BaseBidder {
    static bidderNames() {
      return ["ix", "indexexchange"]
    }

    // eslint-disable-next-line class-methods-use-this
    processParams(platform, au3, sizes, adUnitPath, params) {
      // do any special processing of params here.
      // return false to abort
      console.log("processing indexExchange:", arguments)
      return params
    }
  }

  return (
    <>
      <AdProvider
        bidderClasses={[myBidder]}
        platform="desktop"
        slots={slots}
        debug
        dfpKey="3051"
        au1="001_CafeMom"
        au2="au2"
        au4="au4"
        au5="other_0"
      >
        <h2>Ad Slot</h2>
        <AdSlot id="div-gpt-ad-2321321-2" />
      </AdProvider>
    </>
  )
}
```

## Design Notes

A few notes about the design of AdProvider:

### Configuration

Configuration can be done the 'react way' via props as shown in the example,
but can also be done directly via the `AdConfig` object, which allows you to make
multiple calls which is helpful for progressivly adding to the config.

for example:

```js static
AdConfig.addGlobalTargeting({firstKey: 'firstValue'})
...
AdConfig.addGlobalTargeting({secondKey: 'secondValue'})

//results in targeting being:
{
    firstKey: 'firstValue',
    secondKey: 'secondValue'
}

```

### Custom BidderConfig classes

BidderConfig classes allow us to specify special processing and validation for bidders
similar to `prebid_bidders.tpl` in cafemom. I gave an example of creating one in the example code.

If a bidder doesn't need anything special then there's no need to create one as the default `BaseBidder` should work.

We'll want to add most of them to the wildsky-components repo unless they are specific for momcom.
The bidder classes should go in `src/lib/PrebidConfig/BidderConfig`

when we do add new `BidderConfig` classes, they'll need to be added to `PrebidConfig` so they'll be automatically registered. Just import it, then add the class to the array on this line: https://github.com/FanBread/wildsky-components/blob/develop/src/lib/PrebidConfig/index.js#L13
