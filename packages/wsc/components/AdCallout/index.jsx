import React, { useContext } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { DetectDeviceContext } from "../context/DetectDeviceProvider"

const ScAdCalloutContainer = styled.div`
  min-width: 100%;
  > div {
    min-width: 100%;
  }
`

// [OR-895] Add min height to reserve space for improving CLS
function getAdContainerStyles({ slot, platform = "mobile" }) {
  let containerMinHeight = ""
  let containerLineHeight = ""
  if (!slot || window.pbjs.libLoaded === undefined) return ``

  // The container height is from the suitable min size of ads + maximum font size
  if (
    slot.startsWith("inContent_slot_") ||
    (platform === "desktop" && slot.startsWith("rightRail_slot_"))
  ) {
    containerMinHeight = "270px"
  } else if (platform !== "mobile" && slot === "leader") {
    containerMinHeight = "110px"
  } else if (slot.startsWith("pmp_slot_")) {
    containerMinHeight = "20px"
  } else if (slot === "rhombus") {
    containerMinHeight = "1px"
    containerLineHeight = "0px"
  }

  return `
    ${
      containerMinHeight &&
      `min-height: calc(var(--adContainerMinHeightOffset, 0px) + ${containerMinHeight});`
    }
    ${containerLineHeight && `line-height: ${containerLineHeight};`}
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `
}

/**
 * Provides ads with an *ADVERTISEMENT* callout above the ad.
 *
 */
const ScAdContainer = styled.div`
  > div {
    /** Margin for the ad */
    margin: var(--adCalloutMargin, 0);
    min-width: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
  }

  > div::before {
    content: "ADVERTISEMENT";

    font-size: var(--adCalloutFontSize, 11px);
    letter-spacing: var(--adCalloutSpacing, 0.66px);
    font-family: var(--adCalloutFontFamily, "Avenir Next", sans-serif);
    color: var(--adCalloutColor, #aaa);
    /* Allow to shut off callout heading with CSS by setting to 'none' */
    display: ${(props) =>
      props.showCallout ? "var(--adCalloutDisplay, block)" : "none"};

    text-align: center;
  }

  ${(props) => getAdContainerStyles({ ...props })}
`

const AdCallout = (props) => {
  const { children, showCallout, slot } = props
  const { isDesktop, isMobile } = useContext(DetectDeviceContext)
  const platform = isMobile ? "mobile" : isDesktop ? "desktop" : "tablet"

  return (
    <ScAdCalloutContainer>
      <ScAdContainer showCallout={showCallout} slot={slot} platform={platform}>
        {children}
      </ScAdContainer>
    </ScAdCalloutContainer>
  )
}

AdCallout.defaultProps = {
  showCallout: true,
  slot: null,
}

AdCallout.propTypes = {
  children: PropTypes.node.isRequired,
  showCallout: PropTypes.bool,
  slot: PropTypes.string,
}

export default AdCallout
