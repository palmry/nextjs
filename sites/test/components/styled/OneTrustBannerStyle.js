import { createGlobalStyle } from 'styled-components'
import { COLORS, MEDIA, NAVIGATION_BAR_HEIGHT, PREVIEW_SITE_BAR_HEIGHT } from '../../utils/styles'
import COOKIES_BUTTON from '../../statics/images/cookies-button.svg'

const OneTrustBannerStyle = createGlobalStyle`
  #onetrust-policy-text, p.ot-dpd-desc {
    color: ${COLORS.WHITE} !important;
    padding-bottom: 0 !important;
    line-height: 1.67 !important;
    font-size: 0.75rem !important;
    strong {
      font-weight: 600 !important;
    }
    a {
      background-color: unset !important;
      font-weight: 400 !important;
      margin: 0 !important;
    }
    a:focus { 
      outline: none !important;
    }
  }
  #onetrust-banner-sdk p {
    color: ${COLORS.WHITE} !important;
    margin-bottom: 0px !important;
  }
  #onetrust-banner-sdk strong {
    color: ${COLORS.WHITE} !important;
  }
  #onetrust-banner-sdk u {
    color: ${COLORS.WHITE} !important;
  }
  @media only screen and (max-width: 1023.9px) {
    .ot-dpd-container {
      margin-top: 16px !important;
    }
  }
  #onetrust-pc-btn-handler {
    display: block !important;
    width: 100% !important;
    color: ${COLORS.WHITE} !important;
    background-color: #FFFFFF00 !important;
    border: none !important;
    padding: 0px !important;
    margin: 0 !important; 
    text-decoration: underline !important;
    font-size: 0.75rem !important;
    font-weight: 400 !important;
    min-width: 100px !important;
    max-width: 120px !important;
  }
  #onetrust-banner-sdk.ot-iab-2 #onetrust-pc-btn-handler {
    ${MEDIA.MOBILE`
      margin-right: 10px !important;
      order: -1;
    `}
  }
  #onetrust-accept-btn-handler, #onetrust-reject-all-handler {
    border-color: ${COLORS.LT_DARK_PEACH} !important;
    background-color: ${COLORS.LT_DARK_PEACH} !important;
    font-weight: 600 !important;
    padding: 0 !important;
    margin: 0 !important; 
    height: 50px !important;
    width: 100% !important;
    font-size: 0.88rem !important;
    min-width: 90px !important;
    border-radius: 0 !important;
    ${MEDIA.MOBILE`
      height: 40px !important;
    `}
  }
  #onetrust-banner-sdk.ot-iab-2 #onetrust-accept-btn-handler {
    ${MEDIA.MOBILE`
      margin-right: 0 !important;
      order: 1;
    `}
  }
  #onetrust-banner-sdk.otFlat {
    top: auto;
    z-index: 10001 !important;
    ${MEDIA.MOBILE`
      bottom: auto !important;
      top: 0px;
      transition: transform 0.3s ease-out;
      &.translateWithNavAndPreviewBarOn {
        transform: translateY(${NAVIGATION_BAR_HEIGHT + PREVIEW_SITE_BAR_HEIGHT}px);
      }
      &.translateWithNavBarOn {
        transform: translateY(${NAVIGATION_BAR_HEIGHT}px);
      }
      &.translateWithPreviewSiteBarOn {
        transform: translateY(${PREVIEW_SITE_BAR_HEIGHT}px);
      }
      &.translateWithNoBarOn {
        transform: translateY(0);
      }
    `}
  }
  #onetrust-close-btn-container, #onetrust-close-btn-container-mobile {
    display: none !important;
  }
  #onetrust-banner-sdk {
    background-color: #FFFFFF00 !important;
    overflow-y: hidden !important;
  }
  .banner-background {
    background-color: ${COLORS.LT_DARK_GREY_BLUE_TRANSPARENT} !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    ${MEDIA.MOBILE`
      width: 100% !important;
    `}
    ${MEDIA.TABLET`
      min-height: 117px !important;
    `}
    ${MEDIA.DESKTOP`
      min-height: 117px !important;
    `}
  }
  .banner-group {
    text-align: center !important;
    ${MEDIA.MOBILE`
      padding: 10px !important;
    `}
    ${MEDIA.TABLET`
      padding: 20px 80px !important;
    `}
    ${MEDIA.DESKTOP`
      padding: 16px 20px !important;
      min-width: 902px !important;
      max-width: 1088px !important;
    `}
  }
  #onetrust-button-group {
    margin: 0 0 0 10px !important;
    display: inline-flex !important;
    align-items: center;
    vertical-align: middle !important;
    order: 2 !important;
    & button:not(:last-child) {
      margin: 0 0 10px 0 !important;
    }
    ${MEDIA.MOBILE`
      margin-top: 10px !important;
      order: 3 !important;
      & button:not(:last-child) {
        margin: 0 10px 0 0 !important;
      }
    `}
    ${MEDIA.TABLET`
      width: 194px !important;
      flex-direction: column;
    `}
    ${MEDIA.DESKTOP`
      width: 234px !important;
      flex-direction: column;
    `}
  }
  #onetrust-banner-sdk.ot-iab-2 #onetrust-button-group {
    @media only screen and (min-width: 425px) and (max-width: 550px) {
      width: unset !important;
    }
    ${MEDIA.MOBILE`
      margin-left: 0 !important;
    `}
    ${MEDIA.TABLET`
      width: 120px !important;
    `}
  }
  #onetrust-button-group, .footer-group, {
    & button:hover, button:focus {
      opacity: 1 !important;
      outline: 0 !important;
    }
  }
  .footer-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px !important;
    order: 3 !important;
    ${MEDIA.MOBILE`
      order: 2 !important;
    `}
  }
  #onetrust-group-container {
    width: 100% !important;
    height: auto !important;
    display: contents !important;
    ${MEDIA.MOBILE`
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      flex-wrap: wrap !important;
      flex-direction: row !important;
    `}
  }
  #onetrust-policy {
    margin: 0 !important;
    display: inline-block !important;
    vertical-align: middle !important;
    width: auto !important;
    ${MEDIA.MOBILE`
      max-width: 100% !important;
    `}
    ${MEDIA.TABLET`
      max-width: calc(100% - 204px) !important;
    `}
    ${MEDIA.DESKTOP`
      max-width: calc(100% - 244px) !important;
    `}
  }
  #onetrust-banner-sdk.ot-iab-2 #onetrust-policy {
    ${MEDIA.TABLET`
      max-width: calc(100% - 135px) !important;
      padding-right: 5px;
    `}
  }
  @media only screen and (max-width: 425px) {
    #onetrust-banner-sdk #onetrust-policy-title {
      display: block !important;
    }
  }
  #ot-sdk-btn-floating .ot-floating-button__back {
    background-color: ${COLORS.LT_DARK_PEACH} !important; 
  }
  #ot-sdk-btn-floating .ot-floating-button__front {
    background-image: url(${COOKIES_BUTTON}) !important; 
    background-color: ${COLORS.WHITE} !important;
  }
  #ot-sdk-btn-floating.ot-floating-button{
    ${MEDIA.MOBILE`
      bottom: 132px !important; 
    `}
  }
`

export default OneTrustBannerStyle
