import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { COLORS, FONT_FAMILIES, MEDIA } from '../utils/styles'
import { TOUCH_STATE } from 'wsc/utils/forms'

const ScTextArea = styled.textarea`
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 0.94rem;
  ${MEDIA.MOBILE`font-size: 1rem`}
  line-height: 1.7;
  display: block;
  padding: 1.25rem 1.25rem 0.5rem;
  height: 180px;
  border: 1px solid ${COLORS.LIGHT_GRAY};
  border-radius: 4px;
  width: 100%;
  &::placeholder {
    color: ${COLORS.GREY};
  }
  &:focus {
    outline: none;
    border-color: ${COLORS.LT_DARK_GREY_BLUE};
  }

  ${props =>
    props.isTouchedWithError &&
    `
    &, &:focus {
      outline: none;
      border-color: ${COLORS.LT_DARK_ORANGE};
    }
  `}

  ${props =>
    props.isTouchedNoError &&
    `
    & {
      border-color: ${COLORS.LT_LIGHT_BLUE};
    }
  `}
`

const ScError = styled.div`
  margin-top: 4px;
  line-height: 1.7;
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 0.69rem;
  ${MEDIA.MOBILE`font-size: 0.75rem;`}
  color: ${COLORS.LT_DARK_ORANGE};
`

const TextAreaField = props => {
  const { name, onChange, onBlur, value, placeholder, errMsg, touchState, className } = props
  return (
    <div className={className}>
      <ScTextArea
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        placeholder={placeholder}
        hasValue={!!value}
        isTouchedWithError={touchState === TOUCH_STATE.TOUCHED_ERR}
        isTouchedNoError={touchState === TOUCH_STATE.TOUCHED_NO_ERR}
      ></ScTextArea>
      {touchState === TOUCH_STATE.TOUCHED_ERR && <ScError>{errMsg}</ScError>}
    </div>
  )
}

TextAreaField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  touchState: PropTypes.oneOf([
    TOUCH_STATE.UNTOUCH,
    TOUCH_STATE.TOUCHED_ERR,
    TOUCH_STATE.TOUCHED_NO_ERR,
  ]).isRequired,
  errMsg: PropTypes.string,
  className: PropTypes.string,
}

TextAreaField.defaultProps = {
  errMsg: null,
  className: '',
}

export default TextAreaField
