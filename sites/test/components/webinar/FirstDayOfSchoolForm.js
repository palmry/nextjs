import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import { SubmitButton } from '../button/SubmitButton'
import {
  isValidEmail,
  isValidDueDate,
  isValidUsDateFormat,
  isAgeMoreThan,
  isValidUsZipcode,
  calculatePregnancyWeek,
  TOUCH_STATE,
} from 'wsc/utils/forms'
import { MEDIA, COLORS, FONT_FAMILIES } from '../../utils/styles'
import InputField from '../InputField'
import SelectField from '../SelectField'
import styled from 'styled-components'
import {
  listSubscribe,
  getAndUpdateContact,
  createCustomFieldObject,
} from 'wsc/utils/getResponseAPI'
import Link from 'wsc/components/Link'
import { sendGaEvent } from 'wsc/utils/googleTagManager'
import ICON_4 from 'wsc/statics/images/schoolDay/icon4.png'
import ICON_5 from 'wsc/statics/images/schoolDay/icon5.png'
import ICON_6 from 'wsc/statics/images/schoolDay/icon6.png'

const ScWrapper = styled.div`
  width: 368px;
  padding: 50px 0;
  ${MEDIA.MOBILE_S`
    width: 300px;
  `}
  ${MEDIA.TABLET`
    width: 674px;
  `}
  ${MEDIA.DESKTOP`
    width: 1088px;
    padding: 70px 0;
  `}
`
const ScBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: ${COLORS.SCHOOL_DAY_PURPLE};
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
const ScRsvpIcon = styled.img`
  align-self: center;
  height: 80px;

  ${MEDIA.DESKTOP`
    height: 100px;
  `}
`
const ScHeader = styled.h2`
  align-self: center;
  text-align: center;
  color: ${COLORS.WHITE};
  margin: 20px 0;
  font-weight: 600;
  ${MEDIA.DESKTOP`
    font-size: 2.17rem;
  `}
  ${MEDIA.TABLET`
    width:452px;
  `}
  ${MEDIA.MOBILE`
    margin-top: 10px;
  `}
`
const ScLabel = styled.div`
  font-family: ${FONT_FAMILIES.ASAP};
  margin-bottom: 10px;
  color: ${COLORS.WHITE};
  font-weight: bold;
`
const ScInputField = styled(InputField)`
  margin-bottom: 30px;
`
const ScSelectField = styled(SelectField)`
  margin-bottom: 30px;
`
const ScSubmitButton = styled(({ isActive, ...restProps }) => (
  <SubmitButton {...restProps} />
)).attrs({
  className: 'FirstDayOfSchoolButton',
})`
  font-size: 0.87rem;
  font-weight: 600;
  border-radius: 25px;
  min-width: 206px;
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
    margin: 0 25px;
  `}
`
const ScLink = styled(Link)`
  border: none;
  color: ${COLORS.WHITE};
  text-decoration: underline;

  ${MEDIA.DESKTOP` 
    &:hover {
      color: ${COLORS.SCHOOL_DAY_ORANGE};
      cursor: pointer;
    }
  `}

  &:active {
    color: ${COLORS.SCHOOL_DAY_GREEN};
  }
`
const ScResponseWrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${COLORS.WHITE};
  height: 914px;
  ${MEDIA.TABLET`
    height: 870px;
  `}
`
const ScSuccessHeader = styled.p`
  font-family: ${FONT_FAMILIES.ASAP};
  color: ${COLORS.WHITE};
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
  width: 670px;
  ${MEDIA.TABLET`
    font-size: 1.18rem;
    width: 608px;
  `}
  ${MEDIA.MOBILE`
    font-size: 1.13rem;
    width: 322px;
  `}
  ${MEDIA.MOBILE_S`
    width: 290px;
  `}
`
const ScShareLink = styled.span`
  color: ${COLORS.WHITE};
  border-bottom: 0.125rem solid ${COLORS.WHITE};

  ${MEDIA.DESKTOP` 
    &:hover {
      border-bottom: 0.125rem solid ${COLORS.SCHOOL_DAY_ORANGE};
      color: ${COLORS.SCHOOL_DAY_ORANGE};
      cursor: pointer;
    }
  `}

  &:active {
    border-bottom: 0.125rem solid ${COLORS.SCHOOL_DAY_GREEN};
    color: ${COLORS.SCHOOL_DAY_GREEN};
  }
`

const FirstDayOfSchoolForm = ({ shareRef, RSVPRef, getResponseListToken }) => {
  const [submitted, setSubmitted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(undefined)
  const [parantalStatus, setParantalStatus] = useState(null)
  const dueDateRef = useRef()
  const kidsRef = useRef()

  useEffect(() => {
    if (parantalStatus === 'Pregnant') {
      dueDateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (parantalStatus === 'Kids in household') {
      kidsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [parantalStatus])

  const rsvpValues = {
    fullName: '',
    email: '',
    parentalStatus: '',
    dueDate: '',
    ageOfChild: '',
    birthDate: '',
    zipCode: '',
  }

  const firstDayOfSchoolFormValidator = values => {
    //site can pass in custom error message to replace default error message
    let errors = {}
    if (!isValidEmail(values.email)) {
      errors.email = 'Please enter a valid e-mail address.'
    }
    if (!values.fullName || values.fullName.trim() === '') {
      errors.fullName = 'Please enter your full name.'
    }
    if (!values.birthDate) {
      errors.birthDate = 'Please enter your birthdate.'
    }
    if (values.birthDate) {
      if (!isValidUsDateFormat(values.birthDate)) {
        errors.birthDate = 'Please enter a valid date format "MM/DD/YYYY".'
      } else if (!isAgeMoreThan(values.birthDate, 18)) {
        errors.birthDate = 'You are underage, please come visit us once you are 18.'
      }
    }
    if (!values.parentalStatus) {
      errors.parentalStatus = 'Please choose a valid parental status.'
    }
    if (values.parentalStatus === 'Pregnant' && !values.dueDate) {
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

    if (!values.zipCode) {
      errors.zipCode = 'Please type your zip code.'
    }
    if (values.zipCode && !isValidUsZipcode(values.zipCode)) {
      errors.zipCode = 'Please enter a valid US zip code.'
    }
    return errors
  }

  const signupSuccess = () => {
    sendGaEvent({
      eventName: 'webinarRegister',
      formType: 'static',
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
        <ScRsvpIcon src={ICON_6} />
        <ScSuccessHeader>Thank you for registering!</ScSuccessHeader>
        <ScResponseText>
          {'Please check your email to get your free printable First Day of School banners and '}
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
          <ScRsvpIcon src={ICON_4} />
          <ScHeader>SIGN UP TO GET YOUR FREE FIRST DAY OF SCHOOL BANNERS!</ScHeader>
          <Formik
            initialValues={rsvpValues}
            validate={firstDayOfSchoolFormValidator}
            onSubmit={async values => {
              setSubmitted(true)
              RSVPRef.current.scrollIntoView({ block: 'center' })

              // send data to GetResponse
              const email = values.email
              const name = values.fullName.trim()
              const pregnancyWeek = values.dueDate && calculatePregnancyWeek(values.dueDate)
              const dayOfCycle = '0'
              const customFields = [
                createCustomFieldObject('parental_status', values.parentalStatus),
                createCustomFieldObject('due_date', values.dueDate),
                createCustomFieldObject('pregnancy_week', pregnancyWeek),
                createCustomFieldObject('age_of_child', values.ageOfChild),
                createCustomFieldObject('birthdate', values.birthDate),
                createCustomFieldObject('postal_code', values.zipCode),
              ]

              try {
                await listSubscribe(name, email, customFields, dayOfCycle, getResponseListToken)
              } catch (error) {
                if (
                  error?.response?.data?.httpStatus === 409 &&
                  error?.response?.data?.code === 1008
                ) {
                  // Contact already added
                  try {
                    await getAndUpdateContact(
                      name,
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

              signupSuccess()
            }}
            render={({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
              isValid,
              touched,
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
                    errorTextColor={COLORS.ERROR}
                    touchState={
                      touched.email
                        ? errors.email
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                  />
                  <ScLabel>Full Name*</ScLabel>
                  <ScInputField
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.fullName}
                    name="fullName"
                    placeholder="Your full name"
                    errMsg={errors.fullName}
                    errorTextColor={COLORS.ERROR}
                    touchState={
                      touched.fullName
                        ? errors.fullName
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                  />
                  <ScLabel>Birthdate*</ScLabel>
                  <ScInputField
                    className="rsvp-birth-date"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.birthDate}
                    name="birthDate"
                    placeholder="MM/DD/YYYY"
                    errMsg={errors.birthDate}
                    errorTextColor={COLORS.ERROR}
                    touchState={
                      touched.birthDate
                        ? errors.birthDate
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                  />
                  <ScLabel>Parental Status*</ScLabel>
                  <ScSelectField
                    onChange={e => {
                      handleChange(e)
                      if (e.target.value !== 'Kids in household') {
                        values.ageOfChild = ''
                      }
                      if (e.target.value !== 'Pregnant') {
                        values.dueDate = ''
                      }
                      setParantalStatus(e.target.value)
                    }}
                    onBlur={handleBlur}
                    value={values.parentalStatus}
                    name="parentalStatus"
                    errMsg={errors.parentalStatus}
                    errorTextColor={COLORS.ERROR}
                    touchState={
                      touched.parentalStatus
                        ? errors.parentalStatus
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                    placeholder="Choose One"
                    options={[
                      { value: 'Kids in household', label: 'Kids in household' },
                      { value: 'Trying to conceive', label: 'Trying to conceive' },
                      { value: 'Pregnant', label: 'Pregnant' },
                      { value: 'None of the above', label: 'None of the above' },
                    ]}
                  />
                  {values.parentalStatus === 'Pregnant' && (
                    <>
                      <ScLabel ref={dueDateRef}>Due Date*</ScLabel>
                      <ScInputField
                        className="rsvp-due-date"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.dueDate}
                        name="dueDate"
                        placeholder="MM/DD/YYYY"
                        errMsg={errors.dueDate}
                        errorTextColor={COLORS.ERROR}
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

                  {values.parentalStatus === 'Kids in household' && (
                    <>
                      <ScLabel ref={kidsRef}>
                        If you have a child 1 year old or younger, how old are they?
                      </ScLabel>
                      <ScSelectField
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.ageOfChild}
                        name="ageOfChild"
                        errMsg={errors.ageOfChild}
                        errorTextColor={COLORS.ERROR}
                        touchState={
                          touched.ageOfChild
                            ? errors.ageOfChild
                              ? TOUCH_STATE.TOUCHED_ERR
                              : TOUCH_STATE.TOUCHED_NO_ERR
                            : TOUCH_STATE.UNTOUCH
                        }
                        placeholder="Age of child"
                        options={[
                          { value: '0', label: 'Under 1 month' },
                          { value: '1', label: '1 month' },
                          { value: '2', label: '2 months' },
                          { value: '3', label: '3 months' },
                          { value: '4', label: '4 months' },
                          { value: '5', label: '5 months' },
                          { value: '6', label: '6 months' },
                          { value: '7', label: '7 months' },
                          { value: '8', label: '8 months' },
                          { value: '9', label: '9 months' },
                          { value: '10', label: '10 months' },
                          { value: '11', label: '11 months' },
                          { value: '12', label: '12 months' },
                        ]}
                      />
                    </>
                  )}

                  <ScLabel>Zip Code*</ScLabel>
                  <ScInputField
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.zipCode}
                    name="zipCode"
                    placeholder="e.g. 10012"
                    errMsg={errors.zipCode}
                    errorTextColor={COLORS.ERROR}
                    touchState={
                      touched.zipCode
                        ? errors.zipCode
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                  />
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
          <ScRsvpIcon src={ICON_5} />
        </ScFlexWrapper>
      )}
    </ScWrapper>
  )
}

FirstDayOfSchoolForm.propTypes = {
  shareRef: PropTypes.object.isRequired,
  RSVPRef: PropTypes.object.isRequired,
  getResponseListToken: PropTypes.string.isRequired,
}

export default FirstDayOfSchoolForm
