import React from "react"
import styled from "styled-components"
import SocialButton from "wsc/components/button/SocialButton"
import { MEDIA, COLORS } from "../../utils/styles"

const ScSocialIconGroup = styled.div`
  margin-top: 30px;
  line-height: 0.875rem;
  ${MEDIA.MOBILE`
    margin-top: 24px;
  `}
`

const SocialIconWithMargin = styled(SocialButton)`
  &:not(:first-child) {
    margin-left: 12px;
  }

  ${MEDIA.DESKTOP`
    &:hover * {
      fill: ${COLORS.LT_SUN_YELLOW};
    }
  `}

  &:active * {
    fill: ${COLORS.LT_DARK_SUN_YELLOW};
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SOCIAL_LIST = [
  {
    type: "Facebook",
    url: "https://www.facebook.com/littlethingscom",
  },
  {
    type: "Twitter",
    url: "https://twitter.com/littlethingsusa",
  },
  {
    type: "Instagram",
    url: "https://www.instagram.com/littlethingsusa",
  },
  {
    type: "Youtube",
    url: "https://www.youtube.com/channel/UCUlu-lrertnjTW2WE3s_NXw",
  },
  {
    type: "Pinterest",
    url: "https://www.pinterest.com/littlethingscom",
  },
]

const FooterSocial = () => {
  const socialLink = SOCIAL_LIST.reduce((result, social) => {
    result.push(
      <SocialIconWithMargin
        key={`social-${social.type}`}
        type={social.type}
        redirectUrl={social.url}
        height={"14px"}
      />
    )

    return result
  }, [])

  return <ScSocialIconGroup>{socialLink}</ScSocialIconGroup>
}

FooterSocial.SocialList = {}

FooterSocial.SocialList = {}

export default FooterSocial
