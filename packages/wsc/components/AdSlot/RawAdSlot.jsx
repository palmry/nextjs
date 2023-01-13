import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import deepcopy from 'deepcopy'
import executeAuction from '../../adAuction'
import googletag from '../../googletag'

const getAdUnits = slots =>
  slots.reduce(
    (acc, currSlot) =>
      acc.concat(
        currSlot.prebid.map(currPrebid => ({
          code: currSlot.id,
          mediaTypes: currPrebid.mediaTypes,
          bids: currPrebid.bids,
        }))
      ),
    []
  )

const RawAdSlot = props => {
  const { id, config, globalConfig, outOfPage, callback } = props
  const slotCfg = deepcopy(config)

  const { path, collapseEmptyDiv, targeting = {}, sizes } = slotCfg
  const adUnits = getAdUnits([slotCfg])
  const slotRef = useRef(null)
  useEffect(() => {
    googletag.cmd.push(() => {
      const slot = !outOfPage
        ? googletag.defineSlot(path, sizes, id)
        : googletag.defineOutOfPageSlot(path, id)
      window.gptSlots[id] = slot
      slotRef.current = slot

      if (collapseEmptyDiv && collapseEmptyDiv.length && collapseEmptyDiv.length > 0) {
        slot.setCollapseEmptyDiv(...collapseEmptyDiv)
      }

      Object.keys(targeting).forEach(key => {
        slot.setTargeting(key, targeting[key])
      })
      if (callback) slot.callback = callback
      slot.addService(googletag.pubads())
      window.pbjs.que.push(() => {
        window.pbjs.addAdUnits(adUnits)

        executeAuction({
          ids: [id],
          slots: [slotRef.current],
          globalConfig,
        })
      })
    })

    return () => {
      // teardown this adUnit
      if (window.pbjs && window.pbjs.removeAdUnit) {
        adUnits.forEach(({ code }) => window.pbjs.removeAdUnit(code))
      }
      if (googletag && googletag.destroySlots) {
        googletag.destroySlots([slotRef.current])
      }
    }
  }, [
    adUnits,
    callback,
    collapseEmptyDiv,
    globalConfig,
    id,
    outOfPage,
    path,
    sizes,
    slotCfg,
    targeting,
  ])
  return <div id={id} />
}

RawAdSlot.defaultProps = {
  outOfPage: false,
  callback: null,
}

RawAdSlot.propTypes = {
  id: PropTypes.string.isRequired,
  config: PropTypes.shape({ slots: PropTypes.array }).isRequired,
  outOfPage: PropTypes.bool,
  callback: PropTypes.func,
}

export default RawAdSlot
