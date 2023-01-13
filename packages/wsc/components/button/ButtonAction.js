import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { COLORS, FONT_FAMILIES, withButton } from "../../utils/styles"
import { ReactComponent as IconNavRight } from "../../statics/images/icon-nav-right.svg"

const Button = styled.button.attrs({
  className: "buttonAction",
})`
  ${withButton}
  color: white;
  height: var(--buttonAction_Height, 40px);
  width: 100%;
  max-width: 368px;
  border: none;
  cursor: pointer;
  font-size: 0.93rem;
  font-weight: var(--buttonAction_FontWeight, 600);
  font-stretch: normal;
  font-style: normal;
  vertical-align: bottom;
  line-height: 1.73;
  font-family: var(--buttonAction_FontFamily, ${FONT_FAMILIES.SANSSERIF});
  ${(props) =>
    !props.active &&
    `
    pointer-events: none;
    color: var(--buttonAction_Disable_FontColor, white);
    background-color: var(--buttonAction_Disable_BackgroundColor, ${COLORS.DISABLE});
    svg { fill: var(--buttonAction_Disable_FontColor, ${COLORS.WHITE}); }
    cursor: auto;
  `}
  outline: none;
  -webkit-user-select: none; /* Disable hilighting Chrome all / Safari all */
  -moz-user-select: none; /* Disble hilighting Firefox all */
  -ms-user-select: none; /* Disable hilighting IE 10+ */
  user-select: none; /* Disable hilighting Likely future *
`
const ScImageBox = styled.div`
  display: inline;
  margin-left: 6px;
  svg {
    height: 0.46rem;
    width: 0.46rem;
    vertical-align: middle;
  }
`
export const ButtonAction = (props) => {
  const click = (e) => {
    props.action()
  }
  ButtonAction.propTypes = {
    text: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    action: PropTypes.func.isRequired,
    isWithArrow: PropTypes.bool,
  }
  ButtonAction.defaultProps = {
    isWithArrow: false,
  }
  return (
    <Button active={props.active} onClick={click}>
      {props.text}
      {props.isWithArrow && (
        <ScImageBox>
          <IconNavRight />
        </ScImageBox>
      )}
    </Button>
  )
}
