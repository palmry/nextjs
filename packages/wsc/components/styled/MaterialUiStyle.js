import { createGlobalStyle } from "styled-components"
import { COLORS, MEDIA } from "../../utils/styles"

const MaterialUiStyle = createGlobalStyle`
  .parental-status-holiday,
  .MuiPaper-root-parentalStatusHoliday {
    --checkbox_Color: ${COLORS.HOLIDAY_GREEN};
    --selectedListItem_BgColor: ${COLORS.HOLIDAY_DARK_GREY_BLUE_08};
    --chip_BgColor: ${COLORS.HOLIDAY_SOFT_BROWN};
    --touchRipple_BgColor: ${COLORS.HOLIDAY_GREEN};
  }

  .MuiPopover-root{
    z-index: 10003 !important;
  }

  .MuiInputBase-input{
    padding: 0 !important;
    
    ${(props) =>
      props.height &&
      `
      min-height: ${props.height} !important;
      line-height: ${props.height} !important;
    `}
  }

  .MuiSelect-select:focus{
    background-color: ${COLORS.WHITE} !important;
  }

  .MuiSelect-select, .MuiSelect-select:focus {
    border-radius: 4px !important;
  }

  .MuiSelect-icon {
    right: 12px !important;;
  }

  .MuiMenuItem-root {
    &.MuiMenuItem-root-forCheckBox {
      padding-top: 3px;
      padding-bottom: 3px;
    }
    &.MuiMenuItem-root-forCheckBoxPlaceHolder {
      padding-top: 0;
      padding-bottom: 0;
      min-height: 44px;
      ${MEDIA.MOBILE`min-height: 46px;`}
    }
  }

  .MuiCheckbox-root {
    color: var(--checkbox_Color, #0000008a) !important;
  }

  .MuiCheckbox-colorSecondary.Mui-checked {
    color: var(--checkbox_Color, ${COLORS.BLACK}) !important;
  }

  .MuiIconButton-colorSecondary:hover {
    background-color: var(--selectedListItem_BgColor, #0000000a) !important;
  }

  .MuiListItem-gutters {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .MuiListItem-button:hover, 
  .MuiListItem-button.Mui-focusVisible, 
  .MuiListItem-root.Mui-selected, 
  .MuiListItem-root.Mui-selected:hover {
    background-color: var(--selectedListItem_BgColor, #00000014) !important;
  }
  
  .MuiTouchRipple-child {
    background-color: var(--touchRipple_BgColor, #000000de) !important;
  }

  .MuiChip-root {
    background-color: var(--chip_BgColor, #e0e0e0) !important;
    color: ${COLORS.BLACK} !important;
  }
`

export default MaterialUiStyle
