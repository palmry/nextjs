import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import removeMd from "remove-markdown"
import { getWindowOption, getStringentEncodeURIComponent } from "./redirect"
import ICON_PINTEREST_CIRCLE_IN_WHITE from "../statics/images/icon-pinterest-in-white.svg"
import SocialButton from "../components/button/SocialButton"
import { getConfig } from "../globalConfig"
import { unicodeSlice } from "./unicode"

const APP_CONFIGS = getConfig("AppConfig")
const { COLORS } = getConfig("StyleConfig")

const TRIM_TEXT = "..."
const DESCRIPTION_LENGTH = 500 - TRIM_TEXT.length

const buttonStylePosition = `
  position: absolute;
  z-index: 1;
  right: 1rem;
  top: -1rem;
`

// styled-component
const ScPinterestButtonLayout = styled.div`
  ${buttonStylePosition}
`
// This is CSS style for Pinterest button in content markdown )
export const CssPinterestButton = `
  .pinterest-button {
    ${buttonStylePosition}
    width: 2.63rem;
    height: 2.63rem;
    cursor: pointer;
    border: none;
    background: none;
    &:focus {
      outline: none;
    }

    background-color: var(--socialButton_CircleColor, ${COLORS.LIGHT_BLUE});
    background-image: url(${ICON_PINTEREST_CIRCLE_IN_WHITE});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 19.42px;
    border-radius: 50%;
    &:hover {
      background-color: var(--socialButton_CircleHoverColor, ${COLORS.WARM_YELLOW});
    }
    &:active {
      background-color: var(--socialButton_CircleActiveColor, ${COLORS.BROWN});
    }
  }
`

/**
 * compose request url for saving pin
 * @param {string} postUrl
 * @param {string} postTitle
 * @param {string} itemImageUrl
 * @param {string} itemTitle
 * @param {string} itemContent
 * @returns {string}
 */
export function getRequestUrlSavePin(
  postUrl,
  postTitle,
  itemImageUrl,
  itemTitle,
  itemContent
) {
  const description = getFormattedDescription(postTitle, itemTitle, itemContent)
  // remove markdown from description text
  let convertedDescription = removeMd(description)
  // slice exceed description string
  if (convertedDescription.length > DESCRIPTION_LENGTH)
    convertedDescription =
      unicodeSlice(convertedDescription, 0, DESCRIPTION_LENGTH) + TRIM_TEXT

  const url =
    `https://www.pinterest.com/pin/create/button/` +
    `?url=${encodeURIComponent(postUrl)}` +
    `&media=${encodeURIComponent(itemImageUrl)}` +
    `&description=${getStringentEncodeURIComponent(convertedDescription)}`

  return url
}

/**
 * return pinterest button in React-component or HTML format
 * @param {string} postTitle
 * @param {string} itemTitle
 * @param {string} itemImageUrl
 * @param {string} itemContent
 * @param {boolean} withHTML
 */
export const PinterestButton = ({
  postTitle,
  itemTitle,
  itemImageUrl,
  itemContent,
  withHTML,
}) => {
  const requestUrl = getRequestUrlSavePin(
    window.location.href,
    postTitle,
    itemImageUrl,
    itemTitle,
    itemContent
  )
  return withHTML ? (
    `<button class="pinterest-button"` +
      `onclick="window.open('${requestUrl}', '_blank', '${getWindowOption()}')"></button>`
  ) : (
    <ScPinterestButtonLayout>
      <SocialButton
        type="PinterestCircle"
        height="2.63rem"
        redirectUrl={requestUrl}
        withNewWindow
      />
    </ScPinterestButtonLayout>
  )
}
PinterestButton.propTypes = {
  postTitle: PropTypes.string.isRequired,
  itemTitle: PropTypes.string.isRequired,
  itemImageUrl: PropTypes.string.isRequired,
  itemContent: PropTypes.string,
  withHTML: PropTypes.bool,
}
PinterestButton.defaultProps = {
  itemContent: null,
  withHTML: false,
}

/**
 * return formatted description
 * @param {string} postTitle
 * @param {string} itemTitle
 * @param {string} itemContent
 */
function getFormattedDescription(postTitle, itemTitle, itemContent) {
  // itemTitle and itemContent might be null in markdown content
  return (
    `${APP_CONFIGS.name} ` +
    `${itemTitle ? `: ${itemTitle} ` : ``}` +
    `: ${postTitle} ` +
    `${itemContent ? `-- ${itemContent}` : ``}`
  )
}
