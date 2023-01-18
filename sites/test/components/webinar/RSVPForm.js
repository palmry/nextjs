import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import { SubmitButton } from '../button/SubmitButton'
import {
  isValidEmail,
  isValidDueDate,
  isAgeMoreThan,
  isValidUsZipcode,
  calculatePregnancyWeek,
  TOUCH_STATE,
} from 'wsc/utils/forms'
import { FONT_FAMILIES, MEDIA, COLORS, withFullWidth } from '../../utils/styles'
import InputField from '../InputField'
import SelectField from '../SelectField'
import RSVPDateField from './RSVPDateField'
import styled from 'styled-components'
import { addWebinarRegistrant } from 'wsc/utils/internalRestAPI'
import {
  listSubscribe,
  getAndUpdateContact,
  createCustomFieldObject,
} from 'wsc/utils/getResponseAPI'
import Link from 'wsc/components/Link'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { webShareAPI } from 'wsc/utils/socialShare'
import { sendGaEvent } from 'wsc/utils/googleTagManager'
import { useTranslator } from '../../hooks/useTranslator'

import messengerButton from '../../statics/images/icon-messenger.svg'
import shareButton from '../../statics/images/icon-share.svg'
import rsvpIcon from '../../statics/images/webinar/icon-rsvp.svg'
import yellowStarIcon from '../../statics/images/webinar/icon-yellow-star.svg'

const ScWrapper = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
  background-color: ${COLORS.LT_WEBINAR_DARK_GREEN};
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
const ScRsvpIcon = styled(rsvpIcon)`
  height: 52px;
  ${MEDIA.DESKTOP`
    height: 82px;
  `}
  margin-bottom: 10px;
`
const ScYellowStarIcon = styled(yellowStarIcon)`
  height: 134px;
  ${MEDIA.DESKTOP`
    height: 134px;
  `}
  margin-bottom: 10px;
`
const ScNameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`
const ScNameItem = styled.div`
  width: 100%;
  ${MEDIA.TABLET`
    width: 296px;
  `}
  ${MEDIA.DESKTOP`
    width: 260px;
  `}
`
const ScHeader = styled.h2`
  align-self: center;
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
const ScSelectField = styled(SelectField)`
  margin-bottom: 30px;
`
const ScDateField = styled(RSVPDateField)`
  margin-bottom: 30px;
`
const ScSubmitButton = styled(({ isActive, ...restProps }) => (
  <SubmitButton {...restProps} />
)).attrs({
  className: 'WebinarButton',
})`
  font-weight: 500;
  border-radius: 25px;
  min-width: 174px;
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
  border-bottom: 0.125rem solid ${COLORS.LT_HOSPITAL_GREEN};

  ${MEDIA.DESKTOP` 
    &:hover {
      border-bottom: 0.125rem solid ${COLORS.LT_SUN_YELLOW};
      cursor: pointer;
    }
  `}

  &:active {
    border-bottom: 0.125rem solid ${COLORS.LT_DARK_SUN_YELLOW};
  }
`
const ScMessengerButton = styled(messengerButton)`
  height: 50px;
  width: 50px;
  margin: 0 8px;
  fill: ${COLORS.LT_HOSPITAL_GREEN};

  ${MEDIA.DESKTOP` 
    &:hover {
      fill: ${COLORS.LT_SUN_YELLOW};
      cursor: pointer;
    }
  `}

  &:active {
    fill: ${COLORS.LT_DARK_SUN_YELLOW};
  }
`

const ScShareButton = styled(shareButton)`
  height: 50px;
  width: 50px;
  margin: 0 8px;

  fill: ${COLORS.LT_HOSPITAL_GREEN};

  ${MEDIA.DESKTOP` 
    &:hover {
      fill: ${COLORS.LT_SUN_YELLOW};
      cursor: pointer;
    }
  `}

  &:active {
    fill: ${COLORS.LT_DARK_SUN_YELLOW};
  }
`

const RSVPForm = ({ shareRef, RSVPRef, webinarId, messengerClick }) => {
  const { translator, locale } = useTranslator()
  const { isMobile } = useContext(DetectDeviceContext)
  const [submitted, setSubmitted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(undefined)

  const shareClick = () => {
    webShareAPI()
  }

  const rsvpValues = {
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    zipCode: '',
    parentalStatus: '',
    dueDate: '',
  }

  const rsvpValidator = (values) => {
    //site can pass in custom error message to replace default error message
    let errors = {}
    if (!values.firstName || values.firstName.trim() === '') {
      errors.firstName = translator('Webinar.error.firstNameEmpty')
    }
    if (!values.lastName || values.lastName.trim() === '') {
      errors.lastName = translator('Webinar.error.lastNameEmpty')
    }
    if (!isValidEmail(values.email)) {
      errors.email = translator('Webinar.error.emailInvalid')
    }
    if (values.dueDate) {
      if (!isValidDueDate(values.dueDate)) {
        errors.dueDate = translator('Webinar.error.dueDateInvalidRange')
      }
    }
    if (!values.birthDate) {
      errors.birthDate = translator('Webinar.error.birthDateEmpty')
    }
    if (values.birthDate) {
      if (!isAgeMoreThan(values.birthDate, 18)) {
        errors.birthDate = translator('Webinar.error.belowExpectedAge')
      }
    }
    if (!values.zipCode) {
      errors.zipCode = translator('Webinar.error.zipCodeEmpty')
    }
    if (values.zipCode && !isValidUsZipcode(values.zipCode)) {
      errors.zipCode = translator('Webinar.error.zipCodeInvalid')
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

  const signupError = (error) => {
    console.error(
      error?.response?.data?.message || error?.message || `${error}`
    )
    setIsSuccess(false)
    RSVPRef.current.scrollIntoView({ block: 'center' })
  }

  const ResponseComponent = (isSuccess) => {
    return isSuccess === undefined ? (
      <ScResponseWrapper>
        <ScResponseText>
          {translator('Webinar.rsvpForm.loading')}
        </ScResponseText>
      </ScResponseWrapper>
    ) : isSuccess ? (
      <ScResponseWrapper>
        <ScYellowStarIcon />
        <ScSuccessHeader>
          {translator('Webinar.rsvpForm.thankyou')}
        </ScSuccessHeader>
        <ScResponseText>
          {translator('Webinar.rsvpForm.success1')}
          <ScShareLink
            onClick={() => {
              shareRef.current.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {translator('Webinar.rsvpForm.share')}
          </ScShareLink>
          {translator('Webinar.rsvpForm.success2')}
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
          {translator('Webinar.rsvpForm.fail1')}
          <br />
          {translator('Webinar.rsvpForm.fail2')}
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
          <ScRsvpIcon />
          <ScHeader>RSVP</ScHeader>
          <Formik
            initialValues={rsvpValues}
            validate={rsvpValidator}
            onSubmit={async (values) => {
              setSubmitted(true)
              RSVPRef.current.scrollIntoView({ block: 'center' })

              // send data to Zoom
              try {
                const registerData = {
                  webinarId: webinarId,
                  email: values.email,
                  first_name: values.firstName,
                  last_name: values.lastName,
                  zip: values.zipCode,
                }
                await addWebinarRegistrant(registerData)
              } catch (err) {
                console.error('There was an error:' + err)
                setIsSuccess(false)
                RSVPRef.current.scrollIntoView({ block: 'center' })
                return
              }

              // send data to GetResponse
              const email = values.email
              const firstname = values.firstName.trim()
              const lastname = values.lastName ? values.lastName.trim() : ''
              const name =
                lastname.length > 0 ? `${firstname} ${lastname}` : firstname
              const pregnancyWeek =
                values.dueDate && calculatePregnancyWeek(values.dueDate)
              const customFields = [
                createCustomFieldObject(
                  'parental_status',
                  values.parentalStatus
                ),
                createCustomFieldObject('due_date', values.dueDate),
                createCustomFieldObject('pregnancy_week', pregnancyWeek),
                createCustomFieldObject('birthdate', values.birthDate),
                createCustomFieldObject('postal_code', values.zipCode),
                createCustomFieldObject(
                  'webinar_registrant',
                  'LTholiday202112'
                ),
              ]

              try {
                await listSubscribe(name, email, customFields)
              } catch (error) {
                if (
                  error?.response?.data?.httpStatus === 409 &&
                  error?.response?.data?.code === 1008
                ) {
                  // Contact already added
                  try {
                    await getAndUpdateContact(name, email, customFields)
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
              setFieldValue,
              setFieldTouched,
              values,
              errors,
              isValid,
              touched,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <ScNameWrapper>
                    <ScNameItem>
                      <ScLabel>
                        {translator('Webinar.label.firstName')}*
                      </ScLabel>
                      <ScInputField
                        type='text'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.firstName}
                        name='firstName'
                        placeholder={translator(
                          'Webinar.placeHolder.firstName'
                        )}
                        errMsg={errors.firstName}
                        touchState={
                          touched.firstName
                            ? errors.firstName
                              ? TOUCH_STATE.TOUCHED_ERR
                              : TOUCH_STATE.TOUCHED_NO_ERR
                            : TOUCH_STATE.UNTOUCH
                        }
                      />
                    </ScNameItem>
                    <ScNameItem>
                      <ScLabel>{translator('Webinar.label.lastName')}*</ScLabel>
                      <ScInputField
                        type='text'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastName}
                        name='lastName'
                        placeholder={translator('Webinar.placeHolder.lastName')}
                        errMsg={errors.lastName}
                        touchState={
                          touched.lastName
                            ? errors.lastName
                              ? TOUCH_STATE.TOUCHED_ERR
                              : TOUCH_STATE.TOUCHED_NO_ERR
                            : TOUCH_STATE.UNTOUCH
                        }
                      />
                    </ScNameItem>
                  </ScNameWrapper>
                  <ScLabel>{translator('Webinar.label.email')}*</ScLabel>
                  <ScInputField
                    type='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    name='email'
                    placeholder={translator('Webinar.placeHolder.email')}
                    errMsg={errors.email}
                    touchState={
                      touched.email
                        ? errors.email
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                  />
                  <ScLabel>
                    {translator('Webinar.label.parentalStatus')}
                  </ScLabel>
                  <ScSelectField
                    onChange={(e) => {
                      handleChange(e)
                      setFieldValue('dueDate', '')
                      setFieldTouched('dueDate', false)
                    }}
                    onBlur={handleBlur}
                    value={values.parentalStatus}
                    name='parentalStatus'
                    errMsg={errors.parentalStatus}
                    touchState={
                      touched.parentalStatus
                        ? errors.parentalStatus
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                    placeholder={translator(
                      'Webinar.placeHolder.parentalStatus'
                    )}
                    options={[
                      {
                        value: 'Kids in household',
                        label: translator(
                          'Webinar.optionLabel.parentalStatus.kidsInHousehold'
                        ),
                      },
                      {
                        value: 'Trying to conceive',
                        label: translator(
                          'Webinar.optionLabel.parentalStatus.tryingToConceive'
                        ),
                      },
                      {
                        value: 'Pregnant',
                        label: translator(
                          'Webinar.optionLabel.parentalStatus.pregnancy'
                        ),
                      },
                      {
                        value: 'None of the above',
                        label: translator(
                          'Webinar.optionLabel.parentalStatus.noneOfTheAbove'
                        ),
                      },
                    ]}
                  />
                  {values.parentalStatus === 'Pregnant' && (
                    <React.Fragment>
                      <ScLabel>{translator('Webinar.label.dueDate')}</ScLabel>
                      <ScDateField
                        className='rsvp-due-date'
                        type='text'
                        onBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        value={values.dueDate}
                        name='dueDate'
                        placeholder={translator('Webinar.placeHolder.dueDate')}
                        errMsg={errors.dueDate}
                        touchState={
                          touched.dueDate
                            ? errors.dueDate
                              ? TOUCH_STATE.TOUCHED_ERR
                              : TOUCH_STATE.TOUCHED_NO_ERR
                            : TOUCH_STATE.UNTOUCH
                        }
                      />
                    </React.Fragment>
                  )}
                  <ScLabel>{translator('Webinar.label.birthdate')}*</ScLabel>
                  <ScDateField
                    className='rsvp-birth-date'
                    type='text'
                    onBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    value={values.birthDate}
                    name='birthDate'
                    placeholder={translator('Webinar.placeHolder.birthdate')}
                    errMsg={errors.birthDate}
                    touchState={
                      touched.birthDate
                        ? errors.birthDate
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                  />
                  <ScLabel>{translator('Webinar.label.zipcode')}*</ScLabel>
                  <ScInputField
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.zipCode}
                    name='zipCode'
                    placeholder={translator('Webinar.placeHolder.zipcode')}
                    errMsg={errors.zipCode}
                    touchState={
                      touched.zipCode
                        ? errors.zipCode
                          ? TOUCH_STATE.TOUCHED_ERR
                          : TOUCH_STATE.TOUCHED_NO_ERR
                        : TOUCH_STATE.UNTOUCH
                    }
                  />
                  <ScSubmitButton type='submit' disabled={!isValid}>
                    {translator('Webinar.submitButton')}
                  </ScSubmitButton>
                </form>
              )
            }}
          />
          <ScPrivacy>
            <>
              {'By submitting this form, I agree to the '}
              <ScLink to={'https://www.wildskymedia.com/privacy-policy/'}>
                {'Privacy Policy'}
              </ScLink>
              {', the '}
              <ScLink to={'https://www.wildskymedia.com/terms-of-service/'}>
                {'Terms of Use'}
              </ScLink>
              {', the '}
              <ScLink
                to={
                  'https://www.wildskymedia.com/littlethings-holiday-event-giveaway-terms'
                }
              >
                {'Giveaway Terms'}
              </ScLink>
              {
                ', and to personalized promotions from our partners based on the data submitted.'
              }
            </>
          </ScPrivacy>
        </ScFlexWrapper>
      )}
    </ScWrapper>
  )
}

RSVPForm.propTypes = {
  shareRef: PropTypes.object.isRequired,
  RSVPRef: PropTypes.object.isRequired,
  webinarId: PropTypes.string.isRequired,
  messengerClick: PropTypes.func.isRequired,
}

export default RSVPForm
