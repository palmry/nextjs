import styled from "styled-components"
import { withButton } from "../../utils/styles"
import { DefaultButton } from "./DefaultButton"

const TranslateButton = styled(DefaultButton)`
  height: 28px;
  font-size: 12.6px;
  letter-spacing: 0.76px;
  line-height: 1.7;
  ${withButton}
`

export default TranslateButton
