import { css } from "styled-components"
import { MEDIA } from "../styleUtils"

/**
 * Use css line-clamp to truncate text
 * @param {{
 *  mobileLines?: number,
 *  tabletLines?: number,
 *  desktopLines?: number
 * }} lines the number of lines on mobile, tablet and desktop layout
 * @returns {*} returned value after calling 'css' function
 */
export const withLineClamp = ({ mobileLines, tabletLines, desktopLines }) => {
  // to use -webkit-line-clamp, we also need these css rules
  const requiredCSS = `
     display: -webkit-box;
     -webkit-box-orient: vertical;
     overflow: hidden;
   `
  return css`
    ${mobileLines &&
    MEDIA.MOBILE`
         ${requiredCSS}
         -webkit-line-clamp: ${mobileLines};`}
    ${tabletLines &&
    MEDIA.TABLET`
         ${requiredCSS}
         -webkit-line-clamp: ${tabletLines};`}
     ${desktopLines &&
    MEDIA.DESKTOP`
         ${requiredCSS}
         -webkit-line-clamp: ${desktopLines};`}
  `
}
