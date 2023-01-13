import { css } from "styled-components"
import { MEDIA } from "../styleUtils"

/**
 * generate responsive hidden style
 * __Need these props on a component that calls this variable:__
 * @param {{
 *  existOnDesktop?: boolean,
 *  hideOnDesktop?: boolean,
 *  existOnTablet?: boolean,
 *  hideOnTablet?: boolean,
 *  existOnMobile?: boolean,
 *  hideOnMobile?: boolean
 * }} forwardedProps
 * @returns {*} css function of styled-components
 */
export const withResponsiveHidden = (forwardedProps = {}) => css`
  /* desktop */
  ${forwardedProps.existOnDesktop && MEDIA.MOBILE`display: none`}
  ${forwardedProps.existOnDesktop && MEDIA.TABLET`display: none`}
 
     ${forwardedProps.hideOnDesktop && MEDIA.DESKTOP`display: none`}
 
     /* tablet */
     ${forwardedProps.existOnTablet && MEDIA.DESKTOP`display: none`}
     ${forwardedProps.existOnTablet && MEDIA.MOBILE`display: none`}
 
     ${forwardedProps.hideOnTablet && MEDIA.TABLET`display: none`}
 
     /* mobile */
     ${forwardedProps.existOnMobile && MEDIA.DESKTOP`display: none`}
     ${forwardedProps.existOnMobile && MEDIA.TABLET`display: none`}
 
     ${forwardedProps.hideOnMobile && MEDIA.MOBILE`display: none`}
`
