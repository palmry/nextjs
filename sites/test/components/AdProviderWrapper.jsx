import React, { useContext } from "react"
import { getConfig } from "wsc/globalConfig"
import AdProvider from "wsc/components/AdProvider"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"
import styled, { css } from "styled-components"
import PropTypes from "prop-types"
import { getSessionId } from "wsc/utils/session"
import { MEDIA } from "../utils/styles"

const AdConfig = getConfig("AdConfig")

export const ScAdSlot = styled.div`
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  > div {
    margin: 0 auto;
    box-sizing: border-box;
    ${(props) =>
      props.disabled &&
      css`
        margin: 0 !important;
        padding: 0 !important;
      `}
  }
`
export const ScAdSlotLeader = styled(ScAdSlot)`
  ${(props) =>
    props.bgColor &&
    css`
      background-color: ${props.bgColor};
      ${MEDIA.DESKTOP`background-color: transparent;`}
    `}
  position: relative;
  margin-left: -50vw;
  margin-right: -50vw;
  left: 50%;
  right: 50%;
  width: 100vw;
  overflow: visible;
  > div {
    margin: 0 auto;
    justify-content: center;
    text-align: center;
    display: flex;
    width: 100%;
    ${(props) =>
      props.marginTop &&
      css`
        --adCalloutMargin: ${props.marginTop} 0 0;
        --adContainerMinHeightOffset: ${props.marginTop};
      `}
    div {
      display: block;
      width: 100%;
    }
  }
`
export const ScAdSlotInContent = styled(ScAdSlot)`
  > div > div > div {
    margin: 0 auto 40px auto;
  }
  > div > div {
    --adContainerMinHeightOffset: 40px;
  }
`
export const ScAdSlotRightRail = styled(ScAdSlot)`
  > div {
    margin: 0 auto 50px auto;
  }
  > div > div {
    --adContainerMinHeightOffset: 50px;
  }
`

//adjusts and buckets cpm values from each bid response using the bidAdjustments map found in globalAdTargeting
const bucketPrice = (cpm, bidder) => {
  const tier1 = AdConfig["bidPriceTiers"][0]
  const tier2 = AdConfig["bidPriceTiers"][1]
  let adj_cpm = 0,
    adj = AdConfig["bidAdjustments"][bidder] || 1.0
  cpm = parseFloat(cpm) * adj
  if (cpm < tier1) {
    adj_cpm = (Math.floor(cpm * tier1) / tier1).toFixed(2)
  } else if (cpm >= tier1 && cpm <= tier2) {
    adj_cpm = Math.floor(cpm).toFixed(2)
  } else {
    adj_cpm = tier2
  }
  adj_cpm = (adj_cpm * 100).toFixed(0)
  return adj_cpm
}

//potentially move to wildsky-components repo
//adds custom targeting keys for each bidder and buckets cpm based using bucketPrice function
if (typeof window.pbjs != "undefined") {
  window.pbjs.bidderSettings = (() => {
    const settings = {}
    Object.keys(AdConfig["bidderKeys"]).forEach((key) => {
      const bidder = {
        alwaysUseBid: true,
        adserverTargeting: Object.keys(AdConfig["bidderKeys"][key]).map(
          (key2) => {
            const obj = {
              key: AdConfig["bidderKeys"][key][key2],
              val: (bidResponse) =>
                key2 === "cpm"
                  ? bucketPrice(bidResponse[key2], key)
                  : bidResponse[key2],
            }
            return obj
          }
        ),
      }
      settings[key] = bidder
    })
    return settings
  })()
}

const AdProviderWrapper = (props) => {
  const { isMobile, isTablet } = useContext(DetectDeviceContext)
  const { postId, slotList } = props
  const platform = isMobile ? "mobile" : isTablet ? "tablet" : "desktop"

  // Calculate lpostid for global targeting
  const sessionLPostId = window.sessionStorage.getItem("lpostid")
  const landingPostId = sessionLPostId || postId || "other"
  if (!sessionLPostId) window.sessionStorage.setItem("lpostid", landingPostId)
  AdConfig.globalTargeting["lpostid"] = landingPostId
  AdConfig.globalTargeting["postid"] = postId
  AdConfig.globalTargeting["phpsessid"] = getSessionId()

  // Add default au2 and au4 targeting to slotList
  slotList.forEach((slot, slotKey) => {
    if (Array.isArray(slot)) {
      // eslint-disable-next-line prefer-const
      let cfg = slot[1]
      if (!cfg) cfg = {}
      if (!cfg.targeting) cfg.targeting = {}

      cfg.targeting.au2 = cfg.targeting.au2 || "other"
      cfg.targeting.au4 = cfg.targeting.au4 || "other"
    } else {
      slotList[slotKey] = [
        slot,
        {
          targeting: {
            au2: "other",
            au4: "other",
          },
        },
        1,
      ]
    }
  })

  return (
    <>
      <AdProvider {...props} slotList={slotList} platform={platform} />
    </>
  )
}

AdProviderWrapper.propTypes = {
  postId: PropTypes.string,
  slotList: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  ),
}

AdProviderWrapper.defaultProps = {
  postId: "other",
  slotList: null,
}

export default AdProviderWrapper
