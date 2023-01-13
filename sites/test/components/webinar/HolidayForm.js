import React, { useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import { SubmitButton } from '../button/SubmitButton'
import {
  isValidEmail,
  isValidDueDate,
  isValidUsDateFormat,
  isAgeMoreThan,
  calculatePregnancyWeek,
  TOUCH_STATE,
} from 'wsc/utils/forms'
import { MEDIA, COLORS, FONT_FAMILIES } from '../../utils/styles'
import InputField from '../InputField'
import CheckBox from '../CheckBox'
import styled from 'styled-components'
import {
  listSubscribe,
  getAndUpdateContact,
  createCustomFieldObject,
} from 'wsc/utils/getResponseAPI'
import Link from 'wsc/components/Link'
import { sendGaEvent, parentalStatusVariable } from 'wsc/utils/googleTagManager'
import ICON_4 from 'wsc/statics/images/holiday/icon4.svg'
import ICON_5 from 'wsc/statics/images/holiday/icon5.svg'
import ICON_6 from 'wsc/statics/images/holiday/icon6.svg'

const ScWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 50px 0;

  ${MEDIA.TABLET`
    width: 674px;
  `}
  ${MEDIA.DESKTOP`
    width: 1088px;
    padding: 70px 0 60px;
  `}
`
const ScBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: ${COLORS.HOLIDAY_BROWN};
  border-radius: 30px;
  ${MEDIA.TABLET`
    border-radius: 40px;
  `}
  ${MEDIA.DESKTOP`
    border-radius: 50px;
  `}
`
const ScFlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 23px;
  ${MEDIA.TABLET`
    margin: 0 auto;
    width: 608px;
  `}
  ${MEDIA.DESKTOP`
    margin: 0 auto;
    width: 536px;
  `}
`
const ScIcon4 = styled.img`
  align-self: center;
  width: 60px;
  ${MEDIA.TABLET`
    width: 80px;
  `}
  ${MEDIA.DESKTOP`
    width: 100px;
  `}
`
const ScIcon5 = styled.img`
  align-self: center;
  width: 100px;
  ${MEDIA.MOBILE`
    width: 80px;
  `}
`
const ScIcon6 = styled.img`
  align-self: center;
  height: 80px;
  ${MEDIA.TABLET`
    height: 100px;
  `}
  ${MEDIA.DESKTOP`
    height: 120px;
  `}
`
const ScHeader = styled.h2`
  align-self: center;
  text-align: center;
  color: ${COLORS.HOLIDAY_SOFT_ORANGE};
  margin: 20px 0;
  font-weight: bold;
  text-transform: uppercase;
  ${MEDIA.TABLET`
    width: 452px;
  `}
  ${MEDIA.DESKTOP`
    width: 536px;
    font-size: 2.19rem;
    font-weight: 600;
  `}
`
const ScLabel = styled.div`
  font-family: ${FONT_FAMILIES.ASAP};
  margin-bottom: 10px;
  color: ${COLORS.HOLIDAY_SOFT_ORANGE};
  font-weight: bold;
`
const ScInputField = styled(InputField)`
  margin-bottom: 30px;
`
const ScCheckbox = styled(CheckBox)`
  margin-bottom: 30px;
`

const ScSubmitButton = styled(({ isActive, ...restProps }) => (
  <SubmitButton {...restProps} />
)).attrs({
  className: 'HolidayButton',
})`
  font-size: 0.87rem;
  font-weight: 600;
  border-radius: 22px;
  min-width: 208px;
  height: 44px;
  text-transform: uppercase;

  &:disabled,
  &:disabled:hover,
  &:disabled:active {
    color: ${COLORS.WHITE};
    border: none;
    background-color: ${COLORS.DISABLE};
  }
`
const ScPrivacy = styled.div`
  text-align: center;
  color: ${COLORS.WHITE};
  letter-spacing: 0.72px;
  padding-top: 10px;
  padding-bottom: 20px;
  font-size: 0.75rem;
  ${MEDIA.DESKTOP`
    font-size: 0.69rem;
    padding-top: 20px;
    margin: 0 25px;
  `}
`
const ScLink = styled(Link)`
  border: none;
  color: ${COLORS.WHITE};
  text-decoration: underline;

  ${MEDIA.DESKTOP` 
    &:hover {
      color: ${COLORS.HOLIDAY_DARK_ORANGE};
      cursor: pointer;
    }
  `}

  &:active {
    color: ${COLORS.HOLIDAY_DARK_ORANGE};
  }
`
const ScResponseWrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${COLORS.BLACK};
  height: 914px;
  margin: 0 23px;
  ${MEDIA.TABLET`
    margin: 0 auto;
    width: 608px;
    height: 870px;
  `}
  ${MEDIA.DESKTOP`
    margin: 0 auto;
    width: 536px;
  `}
`
const ScSuccessHeader = styled.p`
  font-family: ${FONT_FAMILIES.ASAP};
  color: ${COLORS.HOLIDAY_SOFT_ORANGE};
  margin: 20px 0;
  line-height: 1.34;
  font-weight: bold;
  font-size: 1.43rem;
  ${MEDIA.TABLET`
    font-size: 1.87rem;
  `}
  ${MEDIA.DESKTOP`
    font-size: 2.18rem;
  `}
`
const ScResponseText = styled.p`
  color: ${COLORS.WHITE};
  font-size: 1.25rem;
  ${MEDIA.DESKTOP`
    width: 714px;
  `}
  ${MEDIA.TABLET`
    font-size: 1.18rem;
  `}
  ${MEDIA.MOBILE`
    font-size: 1.13rem;
  `}
`
const ScShareLink = styled.span`
  color: ${COLORS.WHITE};
  border-bottom: 0.125rem solid ${COLORS.WHITE};

  ${MEDIA.DESKTOP` 
    &:hover {
      border-bottom: 0.125rem solid ${COLORS.HOLIDAY_DARK_ORANGE};
      color: ${COLORS.HOLIDAY_DARK_ORANGE};
      cursor: pointer;
    }
  `}

  &:active {
    border-bottom: 0.125rem solid ${COLORS.HOLIDAY_DARK_ORANGE};
    color: ${COLORS.HOLIDAY_DARK_ORANGE};
  }
`

const HolidayForm = ({ shareRef, RSVPRef, getResponseListToken, title }) => {
  const [submitted, setSubmitted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(undefined)

  const rsvpValues = {
    email: '',
    birthDate: '',
    parentalStatus: [],
    dueDate: '',
  }

  const holidayFormValidator = values => {
    //site can pass in custom error message to replace default error message
    let errors = {}
    if (!isValidEmail(values.email)) {
      errors.email = 'Please enter a valid e-mail address.'
    }
    if (values.birthDate) {
      if (!isValidUsDateFormat(values.birthDate)) {
        errors.birthDate = 'Please enter a valid date format "MM/DD/YYYY".'
      } else if (!isAgeMoreThan(values.birthDate, 18)) {
        errors.birthDate = 'You are underage, please come visit us once you are 18.'
      }
    }
    if (isEmpty(values.parentalStatus)) {
      errors.parentalStatus = 'Please choose a parental status.'
    }
    if (values.parentalStatus.includes('Pregnant') && !values.dueDate) {
      errors.dueDate = 'Please enter your due date.'
    }
    if (values.dueDate) {
      if (/^\d{8}$/.test(values.dueDate)) {
        // auto change MMDDYYYY to MM/DD/YYYY
        values.dueDate =
          `${values.dueDate.slice(0, 2)}/` +
          `${values.dueDate.slice(2, 4)}/${values.dueDate.slice(4, 8)}`
      }
      if (!isValidUsDateFormat(values.dueDate)) {
        errors.dueDate = 'Please enter a valid date format "MM/DD/YYYY".'
      } else if (!isValidDueDate(values.dueDate)) {
        errors.dueDate = 'Please enter a valid due date.'
      }
    }

    return errors
  }

  const signupSuccess = values => {
    sendGaEvent({
      eventName: 'newsletterSubscribe',
      formType: 'event',
      title: title,
      ...parentalStatusVariable(values.parentalStatus),
    })
    setIsSuccess(true)
    RSVPRef.current.scrollIntoView({ block: 'center' })
  }

  const signupError = error => {
    console.error(error?.response?.data?.message || error?.message || `${error}`)
    setIsSuccess(false)
    RSVPRef.current.scrollIntoView({ block: 'center' })
  }

  const ResponseComponent = isSuccess => {
    return isSuccess === undefined ? (
      <ScResponseWrapper>
        <ScResponseText>Loading...</ScResponseText>
      </ScResponseWrapper>
    ) : isSuccess ? (
      <ScResponseWrapper>
        <ScIcon6 src={ICON_6} />
        <ScSuccessHeader>Thank you for registering!</ScSuccessHeader>
        <ScResponseText>
          {'Please check your email to get your free Festive Holiday Printables and '}
          <ScShareLink
            onClick={() => {
              shareRef.current.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            SHARE
          </ScShareLink>
          {' this with your friends!'}
        </ScResponseText>
      </ScResponseWrapper>
    ) : (
      <ScResponseWrapper>
        <ScResponseText>
          Apologies, something has gone wrong. Please refresh and re-submit your registration.
        </ScResponseText>
      </ScResponseWrapper>
    )
  }

  return (
    <ScWrapper>
      <ScBackground />

      {submitted ? (
        ResponseComponent(isSuccess)
      ) : (
        <ScFlexWrapper>
          <ScIcon4 src={ICON_4} />
          <ScHeader>Sign up and receive your free printables straight to your inbox</ScHeader>
          <Formik
            initialValues={rsvpValues}
            validate={holidayFormValidator}
            onSubmit={async values => {
              setSubmitted(true)
              RSVPRef.current.scrollIntoView({ block: 'center' })
              // send data to GetResponse
              const email = values.email
              const pregnancyWeek = values.dueDate && calculatePregnancyWeek(values.dueDate)
              const dayOfCycle = '0'
              const customFields = [
                createCustomFieldObject('parental_status_checkboxes', values.parentalStatus),
                createCustomFieldObject('due_date', values.dueDate),
                createCustomFieldObject('pregnancy_week', pregnancyWeek),
                createCustomFieldObject('birthdate', values.birthDate),
                createCustomFieldObject('signup_source', title),
              ]
              try {
                await listSubscribe(null, email, customFields, dayOfCycle, getResponseListToken)
              } catch (error) {
                if (
                  error?.response?.data?.httpStatus === 409 &&
                  error?.response?.data?.code === 1008
                ) {
                  // Contact already added
                  try {
                    await getAndUpdateContact(
                      null,
                      email,
                      customFields,
                      dayOfCycle,
                      getResponseListToken
                    )
                  } catch (error) {
                    signupError(error)
                    return
                  }
                } else {
                  signupError(error)
                  return
                }
              }
              signupSuccess(values)
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
                  <ScLabel>Email*</ScLabel>
                  <ScInputField
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    name="email"
                    placeholder="name@domain.com"
                    errMsg={errors.email}
                    errorTextColor={COLORS.HOLIDAY_SOFT_RED}
                    touchState={
                      touched.email
                        ? errors.email
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                  />
                  <ScLabel>Birthdate</ScLabel>
                  <ScInputField
                    className="rsvp-birth-date"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.birthDate}
                    name="birthDate"
                    placeholder="MM/DD/YYYY"
                    errMsg={errors.birthDate}
                    errorTextColor={COLORS.HOLIDAY_SOFT_RED}
                    touchState={
                      touched.birthDate
                        ? errors.birthDate
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                  />
                  <ScLabel>Parental Status*</ScLabel>
                  <ScCheckbox
                    className="parental-status-holiday"
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
                    errorTextColor={COLORS.HOLIDAY_SOFT_RED}
                    setFieldValue={setFieldValue}
                    onChangeFunction={e => {
                      const { value } = e.target

                      // Clear value of dueDate is 'Pregnant' is not selected
                      if (!value.includes('Pregnant')) {
                        values.dueDate = ''
                      }
                    }}
                    MenuProps={{ classes: { paper: 'MuiPaper-root-parentalStatusHoliday' } }}
                  />

                  {values.parentalStatus.includes('Pregnant') && (
                    <>
                      <ScLabel>Due Date*</ScLabel>
                      <ScInputField
                        className="rsvp-due-date"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.dueDate}
                        name="dueDate"
                        placeholder="MM/DD/YYYY"
                        errMsg={errors.dueDate}
                        errorTextColor={COLORS.HOLIDAY_SOFT_RED}
                        touchState={
                          touched.dueDate
                            ? errors.dueDate
                              ? TOUCH_STATE.TOUCHED_ERR
                              : TOUCH_STATE.TOUCHED_NO_ERR
                            : TOUCH_STATE.UNTOUCH
                        }
                      />
                    </>
                  )}

                  <ScSubmitButton type="submit" disabled={!isValid}>
                    SIGN ME UP
                  </ScSubmitButton>
                </form>
              )
            }}
          />
          <ScPrivacy>
            {'By submitting this form, I agree to the '}
            <ScLink to={'https://www.wildskymedia.com/privacy-policy/'}>{'Privacy Policy'}</ScLink>
            {', the '}
            <ScLink to={'https://www.wildskymedia.com/terms-of-service/'}>{'Terms of Use'}</ScLink>
            {', and to personalized promotions from our partners based on the data submitted.'}
          </ScPrivacy>
          <ScIcon5 src={ICON_5} />
        </ScFlexWrapper>
      )}
    </ScWrapper>
  )
}

HolidayForm.propTypes = {
  shareRef: PropTypes.object.isRequired,
  RSVPRef: PropTypes.object.isRequired,
  getResponseListToken: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default HolidayForm
