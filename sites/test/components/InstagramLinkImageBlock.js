import React, { useState, useContext } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import ICON_INSTRAGRAM from "../statics/images/icon-instagram-white.svg"
import LinkImageBlock from "./LinkImageBlock"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"

const ScInstagramIcon = styled.img`
  position: absolute;
  z-index: 1; /* need to be higher than z-index of <img/> tag */
  display: block;
  right: 15px;
  bottom: 15px;
`
/** --------------------------------------------------------------------------
 * MAIN COMPONENT(s)
 -----------------------------------------------------------------------------*/

const InstagramLinkImageBlock = (props) => {
  const { to, children } = props
  const { isDesktop } = useContext(DetectDeviceContext)
  const [isHovering, setIsHovering] = useState(false)
  const handleMouseOver = () => {
    if (isDesktop) setIsHovering(true)
  }
  const handleMouseOut = () => {
    setIsHovering(false)
  }
  return (
    <LinkImageBlock
      to={to}
      withDefaultStyle={false}
      isHovering={isHovering}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <ScInstagramIcon src={ICON_INSTRAGRAM} />
      {children}
    </LinkImageBlock>
  )
}

InstagramLinkImageBlock.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default InstagramLinkImageBlock
