import styled from "styled-components"
import React from "react"
import PropTypes from "prop-types"
import { COLORS, FONT_FAMILIES, MEDIA } from "../utils/styles"
import { TOUCH_STATE } from "wsc/utils/forms"

const ScFieldWrapper = styled.div`
  position: relative;
`

const ScInput = styled.input`
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 0.93rem;
  height: 44px;
  ${MEDIA.MOBILE`
    font-size: 1rem;
    height: 46px;
  `}
  line-height: 1.7;
  padding: 12px 20px 0;
  border: 1px solid ${COLORS.LIGHT_GRAY};
  border-radius: 4px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: ${COLORS.LT_DARK_GREY_BLUE};
  }

  ${(props) =>
    props.isTouchedWithError &&
    `
    &, &:focus {
      outline: none;
      border-color: ${COLORS.LT_DARK_ORANGE};
    }
  `}

  ${(props) =>
    props.isTouchedNoError &&
    `
    & {
      border-color: ${COLORS.LT_LIGHT_BLUE};
    }
  `}
`

const ScPlaceHolder = styled.span`
  font-size: 0.94rem;
  ${MEDIA.MOBILE`font-size: 1rem`}
  color: ${COLORS.GREY};
  pointer-events: none;
  position: absolute;
  line-height: 16px;
  top: 0;
  left: 0;
  transform: translate(21px, 13px);
  transition: transform 0.5s, font-size 0.5s;

  ${ScInput}:focus + &,
  ${ScInput}:not([value='']) + & {
    transform: translate(21px, 5px);
    line-height: 1;
    font-size: 0.69rem;
    ${MEDIA.MOBILE`font-size: 0.75rem`}
  }
`

const ScError = styled.div`
  margin-top: 4px;
  line-height: 1.7;
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 0.69rem;
  ${MEDIA.MOBILE`font-size: 0.75rem;`}
  ${(props) => props.color && `color: ${props.color};`}
`

const InputField = (props) => {
  const {
    type,
    onChange,
    onBlur,
    value,
    name,
    placeholder,
    errMsg,
    touchState,
    className,
    errorTextColor,
  } = props
  return (
    <ScFieldWrapper className={className}>
      <ScInput
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        isTouchedWithError={touchState === TOUCH_STATE.TOUCHED_ERR}
        isTouchedNoError={touchState === TOUCH_STATE.TOUCHED_NO_ERR}
      />
      <ScPlaceHolder>{placeholder}</ScPlaceHolder>
      {touchState === TOUCH_STATE.TOUCHED_ERR && (
        <ScError color={errorTextColor}>{errMsg}</ScError>
      )}
    </ScFieldWrapper>
  )
}

InputField.propTypes = {
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  touchState: PropTypes.oneOf([
    TOUCH_STATE.UNTOUCH,
    TOUCH_STATE.TOUCHED_ERR,
    TOUCH_STATE.TOUCHED_NO_ERR,
  ]).isRequired,
  errMsg: PropTypes.string,
  className: PropTypes.string,
  errorTextColor: PropTypes.string,
}

InputField.defaultProps = {
  errMsg: null,
  className: "",
  errorTextColor: COLORS.LT_DARK_ORANGE,
}

export default InputField
