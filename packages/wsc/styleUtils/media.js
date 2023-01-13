import { css } from "styled-components"
import { getConfig } from "../globalConfig"

const { DEVICE_MINWIDTH } = getConfig("StyleConfig")

export const MEDIA = {
  MOBILE_S: (...args) => {
    return css`
      @media (min-width: ${DEVICE_MINWIDTH.MOBILE_S}px) and (max-width: ${DEVICE_MINWIDTH.MOBILE -
        0.1}px) {
        ${css(...args)}
      }
    `
  },
  MOBILE: (...args) => {
    return css`
      @media (max-width: ${DEVICE_MINWIDTH.TABLET - 0.1}px) {
        ${css(...args)}
      }
    `
  },
  TABLET: (...args) => {
    return css`
      @media (min-width: ${DEVICE_MINWIDTH.TABLET}px) and (max-width: ${DEVICE_MINWIDTH.DESKTOP -
        0.1}px) {
        ${css(...args)}
      }
    `
  },
  DESKTOP: (...args) => {
    return css`
      @media (min-width: ${DEVICE_MINWIDTH.DESKTOP}px) {
        ${css(...args)}
      }
    `
  },
}
