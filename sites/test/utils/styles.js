/**-----------------------------------------------
 * Forward variables & functions from other files
 ------------------------------------------------- */
import styleConfig from '../configs/style'
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
} from 'wsc/styleUtils'

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
