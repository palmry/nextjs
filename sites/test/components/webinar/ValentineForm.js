import React, { useState, useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import { SubmitButton } from '../button/SubmitButton'
import {
  isValidEmail,
  isValidDueDate,
  isAgeMoreThan,
  isValidUsDateFormat,
  calculatePregnancyWeek,
  TOUCH_STATE,
} from 'wsc/utils/forms'
import { FONT_FAMILIES, MEDIA, COLORS, withFullWidth } from '../../utils/styles'
import InputField from '../InputField'
import CheckBox from '../CheckBox'
import styled from 'styled-components'
import {
  listSubscribe,
  getAndUpdateContact,
  createCustomFieldObject,
} from 'wsc/utils/getResponseAPI'
import Link from 'wsc/components/Link'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { webShareAPI } from 'wsc/utils/socialShare'
import { useTranslator } from '../../hooks/useTranslator'
import { sendGaEvent, parentalStatusVariable } from 'wsc/utils/googleTagManager'
import { ReactComponent as messengerButton } from '../../statics/images/icon-messenger.svg'
import { ReactComponent as shareButton } from '../../statics/images/icon-share.svg'
import HEART_BOOK from 'wsc/statics/images/valentine/heart-book.png'

const ScWrapper = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
  background-color: ${COLORS.VALENTINE_DARK_PINK};
  ${withFullWidth}
  ${MEDIA.MOBILE`
    padding-top: 30px;
    padding-bottom: 30px;
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
  width: 52px;
  margin-bottom: 20px;
  ${MEDIA.DESKTOP`
    width: 82px;
    margin-bottom: 20px;
  `}
`
const ScHeader = styled.h2`
  align-self: center;
  text-align: center;
  color: ${COLORS.WHITE};
  margin-bottom: 20px;
`
const ScLabel = styled.div.attrs({
  className: 'font-body',
})`
  font-family: ${FONT_FAMILIES.ASAP};
  margin-bottom: 10px;
  color: white;
  font-weight: 600;
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
  className: 'ValentineButton',
})`
  font-weight: 500;
  border-radius: 25px;
  min-width: 240px;
  height: 45px;
  text-transform: uppercase;

  &:disabled,
  &:disabled:hover,
  &:disabled:active {
    color: ${COLORS.WHITE};
    background-color: ${COLORS.LT_LIGHT_GRAY};
  }
`
const ScPrivacy = styled.div`
  text-align: center;
  color: ${COLORS.WHITE};
  padding-top: 10px;
  font-size: 0.75rem;
  ${MEDIA.DESKTOP`
    font-size: 0.69rem;
  `}
`
const ScLink = styled(Link)`
  border: none;
  color: ${COLORS.WHITE};
  text-decoration: underline;
`

const ScResponseWrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${COLORS.WHITE};
  height: 874px;
  ${MEDIA.TABLET`
    height: 856px;
  `}
  ${MEDIA.MOBILE`
    height: 975px;
  `}
`

const ScSuccessHeader = styled.p`
  color: white;
  margin-bottom: 20px;
  line-height: 1.34;
  font-weight: bold;
  font-size: 1.62rem;
  font-family: ${FONT_FAMILIES.ASAP};
  ${MEDIA.TABLET`
    font-size: 2.31rem;
  `}
  ${MEDIA.DESKTOP`
    font-size: 2.94rem;
  `}
`

const ScResponseText = styled.p`
  font-size: 1.25rem;
  width: 720px;
  ${MEDIA.TABLET`
    font-size: 1.18rem;
    width: 608px;
  `}
  ${MEDIA.MOBILE`
    font-size: 1.13rem;
    max-width: 368px;
    margin: 0 23px;
  `}
`

const ScShareSection = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`

const ScShareLink = styled.span`
  border-bottom: 0.125rem solid ${COLORS.WHITE};

  ${MEDIA.DESKTOP` 
    &:hover {
      border-bottom: 0.125rem solid ${COLORS.VALENTINE_PINK};
      color: ${COLORS.VALENTINE_PINK};
      cursor: pointer;
    }
  `}

  &:active {
    border-bottom: 0.125rem solid ${COLORS.VALENTINE_PINK};
    color: ${COLORS.VALENTINE_PINK};
  }
`
const ScMessengerButton = styled(messengerButton)`
  height: 50px;
  width: 50px;
  margin: 0 8px;
  fill: ${COLORS.WHITE};

  ${MEDIA.DESKTOP` 
    &:hover {
      fill: ${COLORS.VALENTINE_PINK};
      cursor: pointer;
    }
  `}

  &:active {
    fill: ${COLORS.VALENTINE_PINK};
  }
`
const ScShareButton = styled(shareButton)`
  height: 50px;
  width: 50px;
  margin: 0 8px;
  fill: ${COLORS.WHITE};

  ${MEDIA.DESKTOP` 
    &:hover {
      fill: ${COLORS.VALENTINE_PINK};
      cursor: pointer;
    }
  `}

  &:active {
    fill: ${COLORS.VALENTINE_PINK};
  }
`

const ValentineForm = ({ shareRef, RSVPRef, messengerClick, title }) => {
  const { locale } = useTranslator()
  const { isMobile } = useContext(DetectDeviceContext)
  const [submitted, setSubmitted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(undefined)

  const shareClick = () => {
    webShareAPI()
  }

  const rsvpValues = {
    email: '',
    birthDate: '',
    parentalStatus: [],
    dueDate: '',
  }

  const valentineFormValidator = values => {
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
        <ScRsvpIcon src={HEART_BOOK} />
        <ScSuccessHeader>Thank you for registering!</ScSuccessHeader>
        <ScResponseText>
          {
            "Please check your email to get your free downloadable Valentine's Day coloring pages and "
          }
          <ScShareLink
            onClick={() => {
              shareRef.current.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            SHARE
          </ScShareLink>
          {' this with your friends!'}
        </ScResponseText>
        <ScShareSection>
          <ScMessengerButton
            onClick={() => {
              messengerClick(locale)
            }}
          />
          {isMobile && (
            <ScShareButton
              onClick={() => {
                shareClick()
              }}
            />
          )}
        </ScShareSection>
      </ScResponseWrapper>
    ) : (
      <ScResponseWrapper>
        <ScResponseText>
          Apologies, something has gone wrong.
          <br />
          Please refresh and re-submit your registration.
        </ScResponseText>
      </ScResponseWrapper>
    )
  }

  return (
    <ScWrapper>
      {submitted ? (
        ResponseComponent(isSuccess)
      ) : (
        <ScFlexWrapper>
          <ScRsvpIcon src={HEART_BOOK} />
          <ScHeader>
            SIGN UP TO GET YOUR FREE
            <br />
            VALENTINE'S DAY PRINTABLES
          </ScHeader>
          <Formik
            initialValues={rsvpValues}
            validate={valentineFormValidator}
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
                await listSubscribe(
                  null,
                  email,
                  customFields,
                  dayOfCycle,
                  process.env.REACT_APP_VALENTINE_GET_RESPONSE_LIST_TOKEN
                )
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
                      process.env.REACT_APP_VALENTINE_GET_RESPONSE_LIST_TOKEN
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
              setFieldValue,
              setFieldTouched,
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
                    className="parental-status-valentine"
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
                    MenuProps={{ classes: { paper: 'MuiPaper-root-parentalStatusValentine' } }}
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
                    SEND ME MY VALENTINES
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
        </ScFlexWrapper>
      )}
    </ScWrapper>
  )
}

ValentineForm.propTypes = {
  shareRef: PropTypes.object.isRequired,
  RSVPRef: PropTypes.object.isRequired,
  messengerClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default ValentineForm
