import styled from "styled-components"
import { COLORS, FONT_FAMILIES } from "../../utils/styles"

export const ShareButton = styled.button`
  border: none; /* remove default browser's styles */
  cursor: pointer;
  color: ${COLORS.WHITE};
  width: auto;
  height: 30px;
  border-radius: 0;
  text-transform: none;
  padding: 0;
  font-family: ${FONT_FAMILIES.POPPINS};

  /* reset line-height */
  line-height: 0;
  background-color: ${COLORS.LT_DARK_GREY_BLUE};

  &:hover {
    background-color: ${COLORS.LT_SUN_YELLOW};
  }

  &:active {
    background-color: ${COLORS.LT_DARK_SUN_YELLOW};
  }
`
