import { css } from "styled-components"
import { MEDIA } from "./media"
import { withFullWidth } from "./withFullWidth"

export const withFullscreenOnMobile = css`
  ${MEDIA.MOBILE`    
    ${withFullWidth}
  `}
`
