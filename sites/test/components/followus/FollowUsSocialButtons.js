import styled from "styled-components"
import SocialButton from "wsc/components/button/SocialButton"
import { COLORS, MEDIA } from "../../utils/styles"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"
import React, { useContext } from "react"

const SocialButtonWithMargin = styled(SocialButton)`
  &:not(:first-child) {
    margin-left: 40px;
    ${MEDIA.TABLET`
    margin-left: 30px;
    `}
    ${MEDIA.MOBILE`
    margin-left: 30px;
    `}
    ${MEDIA.MOBILE_S`
    margin-left: 15px;
    `}
  }
  svg {
    fill: ${COLORS.LT_DARK_GREY_BLUE};
    &:hover {
      fill: ${COLORS.LT_SUN_YELLOW};
    }
    &:active {
      fill: ${COLORS.LT_DARK_SUN_YELLOW};
    }
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SOCIAL_LIST = [
  {
    type: "FacebookBlue",
    url: "https://www.facebook.com/littlethingscom",
  },
  {
    type: "TwitterBlue",
    url: "https://twitter.com/littlethingsusa",
  },
  {
    type: "InstagramBlue",
    url: "https://www.instagram.com/littlethingsusa",
  },
  {
    type: "YoutubeBlue",
    url: "https://www.youtube.com/channel/UCUlu-lrertnjTW2WE3s_NXw",
  },
  {
    type: "PinterestBlue",
    url: "https://www.pinterest.com/littlethingscom",
  },
]

const FollowUsSocialButtons = () => {
  const { isDesktop } = useContext(DetectDeviceContext)
  const socialLink = SOCIAL_LIST.reduce((result, social) => {
    result.push(
      <SocialButtonWithMargin
        key={`social-${social.type}`}
        type={social.type}
        redirectUrl={social.url}
        //desktop , tablet and mobile size
        height={isDesktop ? "40px" : "30px"}
      />
    )

    return result
  }, [])

  return <div>{socialLink}</div>
}

FollowUsSocialButtons.SocialList = {}

export default FollowUsSocialButtons
