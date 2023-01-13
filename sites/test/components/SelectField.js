import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { COLORS, FONT_FAMILIES, MEDIA } from '../utils/styles'
import { TOUCH_STATE } from 'wsc/utils/forms'
import DROPDOWN_ICON from '../statics/images/icon-dropdown-arrow.svg'

const ScSelect = styled.select`
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 0.94rem;
  ${MEDIA.MOBILE`font-size: 1rem`}
  line-height: 1.7;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  display: block;
  height: 44px;
  ${MEDIA.MOBILE`
    height: 46px;
  `}
  padding: 0 1.25rem;
  width: 100%;
  border: 1px solid ${COLORS.LIGHT_GRAY};
  border-radius: 4px;
  background-color: white;
  background-image: url(${DROPDOWN_ICON});
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%;
  background-size: 0.65em auto;
  white-space: nowrap;
  &:focus {
    outline: none;
    border-color: ${COLORS.LT_DARK_GREY_BLUE};
  }
  /* IE11 not support appearance, use this instead */
  &::-ms-expand {
    display: none;
  }

  /* When it is in invalid state */
  ${props =>
    props.isTouchedWithError &&
    `
    &, &:focus {
      outline: none;
      border-color: ${COLORS.LT_DARK_ORANGE};
    }
  `}

  /* When it is in valid state */
  ${props =>
    props.isTouchedNoError &&
    `
    & {
      border-color: ${COLORS.LT_LIGHT_BLUE};
    }
  `}
`

const ScOption = styled.option.attrs({
  className: 'font-small-body',
})``

const ScError = styled.div`
  margin-top: 4px;
  line-height: 1.7;
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 0.69rem;
  ${MEDIA.MOBILE`font-size: 0.75rem;`}
  ${props => props.color && `color: ${props.color};`}
`

const SelectField = props => {
  const {
    name,
    onChange,
    onBlur,
    value,
    errMsg,
    touchState,
    className,
    placeholder,
    options,
    errorTextColor,
  } = props

  const selectOptions = options.map(option => {
    return (
      <ScOption value={`${option.value}`} key={`${option.value}`}>{`${option.label ||
        option.value}`}</ScOption>
    )
  })

  return (
    <div className={className}>
      <ScSelect
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        name={name}
        isTouchedWithError={touchState === TOUCH_STATE.TOUCHED_ERR}
        isTouchedNoError={touchState === TOUCH_STATE.TOUCHED_NO_ERR}
      >
        {placeholder !== null && (
          <ScOption hidden disabled value="">
            {placeholder}
          </ScOption>
        )}
        {selectOptions}
      </ScSelect>
      {touchState === TOUCH_STATE.TOUCHED_ERR && <ScError color={errorTextColor}>{errMsg}</ScError>}
    </div>
  )
}

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  touchState: PropTypes.oneOf([
    TOUCH_STATE.UNTOUCH,
    TOUCH_STATE.TOUCHED_ERR,
    TOUCH_STATE.TOUCHED_NO_ERR,
  ]).isRequired,
  errMsg: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  errorTextColor: PropTypes.string,
}

SelectField.defaultProps = {
  errMsg: null,
  className: '',
  placeholder: null,
  errorTextColor: COLORS.LT_DARK_ORANGE,
}

export default SelectField
