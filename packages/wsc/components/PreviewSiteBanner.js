import React, { useContext } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import { PreviewSiteBannerStateContext } from "./context/PreviewSiteBannerProvider"
import { ReactComponent as CloseIcon } from "../statics/images/icon-close.svg"
import { getConfig } from "../globalConfig"

const ScBanner = styled.div`
  ${(props) =>
    props.backgroundColor && `background-color: ${props.backgroundColor};`}
  position: fixed;
  top: 0;
  height: 40px;
  width: 100%;
  padding: 0 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
`
const ScText = styled.span`
  ${(props) => props.fontSize && `font-size: ${props.fontSize};`}
  ${(props) => props.fontColor && `color: ${props.fontColor};`}
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`
const ScCloseIcon = styled(({ closeIconColor, ...restProps }) => (
  <CloseIcon {...restProps} />
))`
  ${(props) => props.closeIconColor && `fill: ${props.closeIconColor};`}
  height: 15px;
  width: 15px;
  position: absolute;
  top: 12px;
  right: 12px;

  &:hover {
    cursor: pointer;
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const PreviewSiteBanner = (props) => {
  const { isShowPreviewSiteBar, setIsShowPreviewSiteBar } = useContext(
    PreviewSiteBannerStateContext
  )

  return (
    isShowPreviewSiteBar && (
      <ScBanner backgroundColor={props.backgroundColor}>
        <ScText fontSize={props.fontSize} fontColor={props.fontColor}>
          {props.message}
        </ScText>
        <ScCloseIcon
          closeIconColor={props.closeIconColor}
          onClick={() => {
            setIsShowPreviewSiteBar(false)
          }}
        />
      </ScBanner>
    )
  )
}

PreviewSiteBanner.defaultProps = {
  message: `You are previewing ${getConfig("AppConfig")["name"] || "SITE"}`,
  fontSize: "1.13rem",
  fontColor: "white",
  backgroundColor: "#cc6666",
  closeIconColor: "white",
}

PreviewSiteBanner.propTypes = {
  message: PropTypes.string,
  fontSize: PropTypes.string,
  fontColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  closeIconColor: PropTypes.string,
}

export default PreviewSiteBanner
