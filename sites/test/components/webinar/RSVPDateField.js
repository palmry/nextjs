import styled from 'styled-components'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { COLORS, FONT_FAMILIES, MEDIA } from '../../utils/styles'
import { TOUCH_STATE } from 'wsc/utils/forms'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ScFieldWrapper = styled.div`
  position: relative;
  .react-datepicker-wrapper {
    width: 100%;
  }
`

const ScDatePicker = styled(DatePicker)`
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
  margin-bottom: 5px;
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

const ScPlaceHolder = styled.span`
  font-family: ${FONT_FAMILIES.POPPINS};
  color: ${COLORS.GREY};
  pointer-events: none;
  position: absolute;
  line-height: 16px;
  top: 0;
  left: 0;
  transform: translate(21px, 13px);
  transition: transform 0.5s, font-size 0.5s;
  font-size: 0.94rem;
  ${props =>
    (props.isCalendarOpen || props.date !== '') &&
    `
    transform: translate(21px, 5px);
    line-height: 1;
    font-size: 0.69rem;
  `}

  ${MEDIA.MOBILE`
    font-size: 1rem;
    ${props =>
      (props.isCalendarOpen || props.date !== '') &&
      `
      transform: translate(21px, 5px);
      line-height: 1;
      font-size: 0.75rem;
      
    `}
  `}
}
`

const ScError = styled.div`	
  margin-top: 4px;	
  line-height: 1.7;	
  font-family: ${FONT_FAMILIES.POPPINS};	
  font-size: 0.69rem;	
  ${MEDIA.MOBILE`font-size: 0.75rem;`}
  color: ${COLORS.LT_DARK_ORANGE};
`

const RSVPDateField = props => {
  const {
    onBlur,
    setFieldValue,
    setFieldTouched,
    name,
    placeholder,
    errMsg,
    touchState,
    className,
  } = props
  const [date, setDate] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleCalendarOpen = () => {
    setIsCalendarOpen(true)
  }

  const handleCalendarClose = () => {
    setIsCalendarOpen(false)
  }

  const onValueChange = value => {
    setDate(value ? value : '')
    setFieldValue(
      name,
      value
        ? value
            .toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .replace(/(\d+)\/(\d+)\/(\d+)/, '$1/$2/$3')
        : ''
    )
    setFieldTouched(name, true)
  }

  return (
    <ScFieldWrapper className={className}>
      <ScDatePicker
        selected={date}
        onChange={onValueChange}
        onCalendarOpen={handleCalendarOpen}
        onCalendarClose={handleCalendarClose}
        onBlur={onBlur}
        name={name}
        isTouchedWithError={touchState === TOUCH_STATE.TOUCHED_ERR}
        isTouchedNoError={touchState === TOUCH_STATE.TOUCHED_NO_ERR}
      />
      <ScPlaceHolder isCalendarOpen={isCalendarOpen} date={date}>
        {placeholder}
      </ScPlaceHolder>
      {touchState === TOUCH_STATE.TOUCHED_ERR && <ScError>{errMsg}</ScError>}
    </ScFieldWrapper>
  )
}

RSVPDateField.propTypes = {
  onBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  touchState: PropTypes.oneOf([
    TOUCH_STATE.UNTOUCH,
    TOUCH_STATE.TOUCHED_ERR,
    TOUCH_STATE.TOUCHED_NO_ERR,
  ]).isRequired,
  errMsg: PropTypes.string,
  className: PropTypes.string,
}

RSVPDateField.defaultProps = {
  errMsg: null,
  className: '',
}

export default RSVPDateField
