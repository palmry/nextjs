import { getConfig } from "../globalConfig"
import styled from "styled-components"

const { COLORS } = getConfig("StyleConfig")

export const ScFieldWrapper = `
    position: relative;
`

export const inputBoxDefault = `
    border-radius: 3px;
    padding: 1.25rem 1.25rem 0;
    height: 3.125rem;
    border: 1px solid var(--inputBoxDefault_borderColor, ${COLORS.DARK_GRAY});
    width: 100%;
    margin-bottom: 5px;
    &:focus {
        outline: none;
        border-color: var(--inputBoxFocus_borderColor, ${COLORS.FOCUS});
    }
`

export const inputBoxTouchedWithError = `
    outline: none;
    border-color: var(--inputBoxError_color, ${COLORS.ERROR});
`

export const inputBoxTouchedWithNoError = `
    border-color: var(--inputBoxValid_borderColor, ${COLORS.VALID});
`

export const defaultPlaceholder = `
    color: var(--defaultPlaceholder_color, ${COLORS.DARK_GRAY});
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(1.25rem, 1rem);
    transition: all 0.5s;
`

export const focusPlaceholder = `
    transform: translate(1.25rem, 0.31rem);
    font-size: 0.79rem;
`

export const ScError = styled.div.attrs({
  className: "font-description",
})`
  color: var(--inputBoxError_color, ${COLORS.ERROR});
`
