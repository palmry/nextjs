import { css } from "styled-components"

/**
 * get component's left arrow
 * __REQUIRE POSITION RELATIVE ON PARENT__
 * @param {string} mainHeight
 * @param {string} color
 * @returns {*} returned value after calling 'css' function
 */
export function withRightTriangleArrow(mainHeight, color) {
  return css`
    position: absolute;
    right: -20px;
    border-top: calc(${mainHeight} / 2) solid transparent;
    border-bottom: calc(${mainHeight} / 2) solid transparent;
    border-left: 20px solid ${color};
  `
}
