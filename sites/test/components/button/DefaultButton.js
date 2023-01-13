import styled from "styled-components"
import Link from "wsc/components/Link"
import { FONT_FAMILIES } from "../../utils/styles"

export const DefaultButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  text-transform: none;
  text-decoration: none;
  border: none;
  height: 40px;
  font-family: ${FONT_FAMILIES.POPPINS};

  /* reset line-height */
  line-height: 0;
`
