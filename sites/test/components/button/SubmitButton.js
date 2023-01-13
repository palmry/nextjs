import styled from "styled-components"
import { withButton, MEDIA, COLORS } from "../../utils/styles"

export const SubmitButton = styled.button.attrs({
  className: "font-button withButtonDark",
})`
  display: block;
  margin: 0 auto;
  font-weight: 500;
  border: none;
  height: 3.125rem;
  width: 10.75rem;
  cursor: pointer;

  ${MEDIA.TABLET`
    width: 8.75rem;
  `}
  ${MEDIA.DESKTOP`
    height: 2.5rem;
  `}

  ${withButton}

  &:disabled,
  &:disabled:hover,
  &:disabled:active {
    svg {
      fill: ${COLORS.WHITE};
    }
    background-color: ${COLORS.LT_LIGHT_GRAY};
    cursor: unset;
  }
`
