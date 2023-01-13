import React, { useContext } from "react"
import GridList from "../GridList"
import FancyHeader from "../FancyHeader"
import FollowUsSocialButtons from "../followus/FollowUsSocialButtons"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"
import { useTranslator } from "../../hooks/useTranslator"
import ResponsiveImage from "../ResponsiveImage"
import InstagramLinkImageBlock from "../InstagramLinkImageBlock"
import INSTAGRAM_CONFIGS from "../../statics/configs/instagram.json"

// import axios from 'axios'
import styled from "styled-components"
import { COLORS, withFullWidth } from "../../utils/styles"
import { MEDIA } from "../../utils/styles"

const ScWrapper = styled.div`
  position: relative;
  text-align: center;
  padding-bottom: 3.75rem;
`
const ScSocialWrapper = styled.div`
  line-height: 1;
  margin: 30px 0;
  text-align: center;
`
const ScBackgroundBoxDiv = styled.div`
  position: absolute;
  padding-top: 11.31rem;
  ${MEDIA.DESKTOP`padding-top: 12.94rem;`}
  ${MEDIA.TABLET`padding-top: 11.88rem; `}
  height: 100%;
  width: 100%;
  top: 0;
  z-index: -1;
`

const ScBackgroundBoxColor = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  bottom: 0;
  background: ${COLORS.LT_SUN_YELLOW};
  ${withFullWidth}
`

const FollowUsResponseImage = () => {
  const { isDesktop, isTablet, isMobile } = useContext(DetectDeviceContext)
  let instagramImageList = isDesktop
    ? INSTAGRAM_CONFIGS.slice(0, 3)
    : isTablet
    ? INSTAGRAM_CONFIGS.slice(0, 2)
    : INSTAGRAM_CONFIGS.slice(0, 1)
  const { translator } = useTranslator()

  return (
    <ScWrapper>
      <FancyHeader
        title={translator("global.followUs")}
        withCenterLayout={false}
        withUnderline={true}
        underlineColor={COLORS.LT_SUN_YELLOW}
      />
      <ScSocialWrapper>
        <FollowUsSocialButtons />
      </ScSocialWrapper>
      <GridList column={isDesktop ? 3 : isTablet ? 2 : 1} columnGap={"1rem"}>
        {instagramImageList.map((instagram, i) => (
          <InstagramLinkImageBlock key={instagram.image} to={instagram.url}>
            {isMobile ? (
              <ResponsiveImage
                key={instagram.image}
                src={instagram.image}
                squareSize="100%"
                isSqrFlex={true}
              />
            ) : (
              <ResponsiveImage
                key={instagram.image}
                src={instagram.image}
                squareSize={isDesktop ? "352px" : "296px"}
              />
            )}
          </InstagramLinkImageBlock>
        ))}
      </GridList>

      <ScBackgroundBoxDiv>
        <ScBackgroundBoxColor />
      </ScBackgroundBoxDiv>
    </ScWrapper>
  )
}

export default FollowUsResponseImage
