/**-----------------------------------------------
 * Forward variables & functions from other files
 ------------------------------------------------- */
// TODO: We need to call setConfig at App.js to overwrite the default value.
import { getConfig } from '../globalConfig'

import {
  rgba,
  withFullWidth,
  withFullscreenOnMobile,
  MEDIA,
  ScFieldWrapper,
  inputBoxDefault,
  inputBoxTouchedWithError,
  inputBoxTouchedWithNoError,
  defaultPlaceholder,
  focusPlaceholder,
  ScError,
  withImageBoxShadow,
  withFlexCenter,
  withLineClamp,
  withStickyPosition,
  withRightTriangleArrow,
  withResponsiveHidden,
  withButton,
} from '../styleUtils'

const styleConfig = getConfig('StyleConfig')

const {
  COLORS,
  FOOTER_HEIGHT,
  NAVIGATION_BAR_HEIGHT,
  PREVIEW_SITE_BAR_HEIGHT,
  PADDINGS,
  PAGE_WIDTHS,
  DEVICE_MINWIDTH,
  FONT_FAMILIES,
  POST_ITEM_IMAGE_TYPE,
} = styleConfig

COLORS['rgba'] = rgba

export {
  COLORS,
  FOOTER_HEIGHT,
  NAVIGATION_BAR_HEIGHT,
  PREVIEW_SITE_BAR_HEIGHT,
  PADDINGS,
  PAGE_WIDTHS,
  DEVICE_MINWIDTH,
  FONT_FAMILIES,
  POST_ITEM_IMAGE_TYPE,
  MEDIA,
  withFullWidth,
  withFullscreenOnMobile,
  ScFieldWrapper,
  inputBoxDefault,
  inputBoxTouchedWithError,
  inputBoxTouchedWithNoError,
  defaultPlaceholder,
  focusPlaceholder,
  ScError,
  withImageBoxShadow,
  withFlexCenter,
  withLineClamp,
  withStickyPosition,
  withRightTriangleArrow,
  withResponsiveHidden,
  withButton,
}
