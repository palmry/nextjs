import React, { useState, useContext } from "react"
import styled from "styled-components"
import LazyLoad from "react-lazyload"
import PropTypes from "prop-types"
import AdProviderContext from "../AdProvider/AdProviderContext"
import AdConfig from "../AdProvider/AdConfig"
import AdCallout from "../AdCallout"
import RawAdSlot from "./RawAdSlot"

const ScLazyLoadPlaceholder = styled.div`
  > div {
    margin: 0 auto;
  }
`

const AdSlot = (props) => {
  const {
    refresh,
    au3,
    number,
    targeting,
    lazy,
    lazyLoadOffset,
    lazyLoadPlaceholder,
    showCallout,
    teardown,
    appendId,
    outOfPage,
    callback,
  } = props

  let { id } = props

  const {
    refreshSlot,
    slotIdMap,
    getSlotConfig,
    debug,
    globalConfig,
    enabled,
    platform,
  } = useContext(AdProviderContext)

  const [refreshState, setRefresh] = useState(refresh)
  if (!enabled) return <></>

  if (id) {
    id = `${id}${appendId}`
  } else {
    if (au3 && slotIdMap) {
      if (au3 in slotIdMap) {
        if (number !== undefined) {
          if (Array.isArray(slotIdMap[au3])) {
            id = `${slotIdMap[au3][number]}${appendId}`
          }
        } else {
          id = `${slotIdMap[au3]}${appendId}`
        }
      }
    }
  }

  if (!AdConfig.hasSlot(id) && getSlotConfig) {
    const cfg = getSlotConfig(au3, number)
    // eslint-disable-next-line prefer-destructuring
    if (!id) id = `${cfg.id}${appendId}`
    if (!AdConfig.hasSlot(id)) {
      // eslint-disable-next-line no-console
      if (debug)
        console.warn(
          "adconfig doesn't have a slot for me! Attempting to add one...",
          props,
          cfg
        )

      AdConfig.addSlotConfig(id, cfg)
    }
  }
  if (targeting) AdConfig.addSlotTargeting(id, targeting)
  if (au3) AdConfig.addSlotTargeting(id, { au3 })

  if (refresh !== refreshState) {
    refreshSlot(id)
    setRefresh(refresh)
  }

  let adSlotComponent = (
    <RawAdSlot
      id={id}
      config={AdConfig.getBuiltSlotConfig(id, platform)}
      globalConfig={globalConfig}
      outOfPage={outOfPage}
      callback={callback}
    />
  )

  if (lazy) {
    adSlotComponent = (
      <LazyLoad placeholder={lazyLoadPlaceholder} once offset={lazyLoadOffset}>
        {adSlotComponent}
      </LazyLoad>
    )
  }

  return (
    <AdCallout showCallout={showCallout} slot={au3}>
      {adSlotComponent}
    </AdCallout>
  )
}

AdSlot.defaultProps = {
  lazy: false,
  lazyLoadOffset: 1000,
  disabled: false,
  lazyLoadPlaceholder: <ScLazyLoadPlaceholder />,
  showCallout: true,
  teardown: true,
  appendId: "",
  outOfPage: false,
  callback: null,
}

AdSlot.propTypes = {
  lazy: PropTypes.bool,
  disabled: PropTypes.bool,
  lazyLoadOffset: PropTypes.number,
  lazyLoadPlaceholder: PropTypes.element,
  showCallout: PropTypes.bool,
  callback: PropTypes.func,
  /**
   * Specifies whether to tear down ads and rebuild to add this slot if its not in the slotList.
   * Defaults to true
   */
  teardown: PropTypes.bool,
  /** Optional string to append to the end of the div id. Usefull for infinite scroll */
  appendId: PropTypes.string,
  outOfPage: PropTypes.bool,
}

export default AdSlot
