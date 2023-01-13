import { css } from "styled-components"
import { getConfig } from "../globalConfig"
import { MEDIA } from "../styleUtils"

const { COLORS } = getConfig("StyleConfig")
/**
 * get image box shadow style
 * __Need these props on a component that calls this variable:__
 * @param {boolean} isStaticShadowLength
 */
export const withImageBoxShadow = css`
  ${(props) => {
    const { isStaticShadowLength } = props
    const color = `var(--withImageBoxShadow_boxShadowColor, ${COLORS.LIGHT_BLUE})`
    const length = `var(--withImageBoxShadow_boxShadowLength, 15px)`
    return isStaticShadowLength
      ? css`
          -webkit-box-shadow: ${length} ${length} 0px 0px ${color};
          -moz-box-shadow: ${length} ${length} 0px 0px ${color};
          box-shadow: ${length} ${length} 0px 0px ${color};
        `
      : css`
          -webkit-box-shadow: ${length} ${length} 0px 0px ${color};
          -moz-box-shadow: ${length} ${length} 0px 0px ${color};
          box-shadow: ${length} ${length} 0px 0px ${color};
          ${MEDIA.TABLET`box-shadow: calc(${length} + 5px) calc(${length} + 5px) 0px 0px ${color};`}
          ${MEDIA.DESKTOP`box-shadow: calc(${length} + 5px) calc(${length} + 5px) 0px 0px ${color};`}
        `
  }}
`
