import React from 'react'
import { Formik } from 'formik'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { subscribeValues, subscribeValidator, TOUCH_STATE } from 'wsc/utils/forms'
import InputField from './InputField'
import CheckBox from './CheckBox'
import { SubmitButton } from './button/SubmitButton'
import { COLORS, MEDIA, FONT_FAMILIES } from '../utils/styles'
import { ReactComponent as IconNavLeft } from '../statics/images/icon-nav-left.svg'

const ScLabel = styled.div`
  text-align: left;
  font-family: ${FONT_FAMILIES.ASAP};
  font-size: 1.13rem;
  ${MEDIA.TABLET`font-size: 1.19rem;`}
  ${MEDIA.DESKTOP`font-size: 1.25rem;`}
  font-weight: bold;
  line-height: 1.7;
  margin-bottom: 10px;
`
const ScInputField = styled(InputField)`
  margin-bottom: 16px;
`
const ScCheckbox = styled(CheckBox)`
  margin-bottom: 16px;
`
const ScSubmitButton = styled(SubmitButton)`
  margin-top: 40px;
  margin-bottom: 10px;
  text-align: center;
  height: 50px;
  width: 100%
  max-width: 368px;
  ${MEDIA.TABLET`
    height: 50px;
    width: 100%
    max-width: 368px;
  `}
  ${MEDIA.DESKTOP`
    height: 50px;
  `}
`
const ScImageBox = styled.div`
  display: inline;
  margin-left: 0.38rem;
  svg {
    fill: ${props => (props.disabled ? COLORS.LT_GREY : COLORS.WHITE)};
    height: 0.56rem;
    width: 0.56rem;
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/
const SubscribeForm = props => {
  return (
    <Formik
      initialValues={subscribeValues}
      validate={values =>
        subscribeValidator(values, {
          expectedAge: props.expectedAge,
        })
      }
      onSubmit={values => {
        props.onSubmit(values)
      }}
      render={({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        isValid,
        touched,
        setFieldValue,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <props.scLabel>Email*</props.scLabel>
            <ScInputField
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              name="email"
              placeholder="name@domain.com"
              errMsg={errors.email}
              touchState={
                touched.email
                  ? errors.email
                    ? TOUCH_STATE.TOUCHED_ERR
                    : TOUCH_STATE.TOUCHED_NO_ERR
                  : TOUCH_STATE.UNTOUCH
              }
              errorTextColor={props.errorTextColor}
            />
            <props.scLabel>Birthdate</props.scLabel>
            <ScInputField
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.birthdate}
              name="birthdate"
              placeholder="MM/DD/YYYY"
              errMsg={errors.birthdate}
              touchState={
                touched.birthdate
                  ? errors.birthdate
                    ? TOUCH_STATE.TOUCHED_ERR
                    : TOUCH_STATE.TOUCHED_NO_ERR
                  : TOUCH_STATE.UNTOUCH
              }
              errorTextColor={props.errorTextColor}
            />
            <props.scLabel>Parental Status*</props.scLabel>
            <ScCheckbox
              className="parental-status"
              items={[
                'Trying to Conceive',
                'Pregnant',
                'Child Under 2',
                'Preschool (3-5)',
                'Big Kid (6-9)',
                'Tween (10-12)',
                'Teen (13-17)',
                'None of the Above',
              ]}
              name="parentalStatus"
              errMsg={errors.parentalStatus}
              setFieldValue={setFieldValue}
              onChangeFunction={e => {
                const { value } = e.target

                // Clear value of dueDate is 'Pregnant' is not selected
                if (!value.includes('Pregnant')) {
                  values.dueDate = ''
                }
              }}
            />
            {values.parentalStatus.includes('Pregnant') && (
              <>
                <props.scLabel>Due Date*</props.scLabel>
                <ScInputField
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dueDate}
                  name="dueDate"
                  placeholder="MM/DD/YYYY"
                  errMsg={errors.dueDate}
                  touchState={
                    touched.dueDate
                      ? errors.dueDate
                        ? TOUCH_STATE.TOUCHED_ERR
                        : TOUCH_STATE.TOUCHED_NO_ERR
                      : TOUCH_STATE.UNTOUCH
                  }
                  errorTextColor={props.errorTextColor}
                />
              </>
            )}
            {/* TODO: We need to implement the option to enable right arrow icon in refactoring project */}
            <props.scSubmitButton type="submit" disabled={!isValid}>
              {props.submitButtonLabel}
              {props.submitButtonWithArrow && (
                <ScImageBox disabled={!isValid}>
                  <IconNavLeft />
                </ScImageBox>
              )}
            </props.scSubmitButton>
          </form>
        )
      }}
    />
  )
}

SubscribeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errorTextColor: PropTypes.string,
  scLabel: PropTypes.object,
  scSubmitButton: PropTypes.object,
  submitButtonLabel: PropTypes.string,
  submitButtonWithArrow: PropTypes.bool,
  expectedAge: PropTypes.number,
}

SubscribeForm.defaultProps = {
  errorTextColor: COLORS.LT_DARK_ORANGE,
  scLabel: ScLabel,
  scSubmitButton: ScSubmitButton,
  submitButtonLabel: 'SUBSCRIBE TO LITTLETHINGS',
  submitButtonWithArrow: true,
  expectedAge: 18,
}

export default SubscribeForm
