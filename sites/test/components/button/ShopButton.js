import styled from "styled-components"
import { withButton, FONT_FAMILIES } from "../../utils/styles"

export const ShopButton = styled.a`
  /* remove default browser's styles */
  text-decoration: none;

  /* imitate <button/> */
  display: inline-block;
  border: none;
  cursor: pointer;
  border-radius: 0;
  text-transform: none;
  font-weight: 600;
  font-size: 0.94rem;
  width: 102px;
  height: 40px;
  line-height: 40px; /* equal to the height for vertical align hack */
  text-align: center; /* horizontal align */
  font-family: ${FONT_FAMILIES.POPPINS};
  margin-left: 20px;

  ${withButton}
`
