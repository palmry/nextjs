import { css } from "styled-components"

export const createFontStyles = (styles) => {
  let fontStyles = ``
  styles.forEach((style) => {
    fontStyles += `
    @font-face {
      font-family: '${style.fontFamily}';
      src: url(${style.url}) format('${style.format}');
      font-weight: ${style.fontWeight};
      font-style: ${style.fontStyle};
      font-display: swap;
    }
    `
  })
  return css`
    ${fontStyles}
  `
}
