import React from 'react'
import { Formik } from 'formik'
import { SubmitButton } from '../button/SubmitButton'
import {
  contactUsValues,
  contactUsValidator,
  TOUCH_STATE,
  autoCompleteUsPhoneNumber,
} from 'wsc/utils/forms'
import { COLORS, MEDIA } from '../../utils/styles'
// import Link from "wsc/components/Link"
import DefaultInputField from '../InputField'
import DefaultSelectField from '../SelectField'
import DefaultTextAreaField from '../TextAreaField'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { sendEmail } from 'wsc/utils/internalRestAPI'
import Layout from '../Layout'
import DocumentHead from '../DocumentHead'
import IconNavLeft from '../../statics/images/icon-nav-left.svg'

const ScFlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 50px;
  ${MEDIA.TABLET`
    margin-top: 40px;
  `}
  ${MEDIA.DESKTOP`
    margin-top: 40px;
    margin-left: auto;
    margin-right: auto;
    width: 720px;
  `}
`

const ScHeader = styled.div.attrs({ className: 'font-section-header-1' })`
  align-self: center;
  border-bottom: 3px solid ${COLORS.LT_HOSPITAL_GREEN};
  margin-bottom: 20px;
`

const ScOptOutText = styled.p`
  text-align: center;
  margin-bottom: 40px;
  font-size: 0.94rem;
  line-height: 1.73;

  ${MEDIA.MOBILE`
    margin-bottom: 30px;
    font-size: 1rem;
    line-height: 1.69;
  `}
`

// const ScOptOutLink = styled(Link)`
const ScOptOutLink = styled.a`
  text-decoration: underline;
`

const ScLabel = styled.div.attrs({
  className: 'font-body',
})`
  margin-bottom: 10px;
`

const InputField = styled(DefaultInputField)`
  margin-bottom: 30px;
`

const SelectField = styled(DefaultSelectField)`
  margin-bottom: 30px;
`

const TextAreaField = styled(DefaultTextAreaField)`
  margin-bottom: 30px;
`

const ScOptionalText = styled.span`
  color: ${COLORS.GREY};
`

const ScImageBox = styled.div`
  display: inline;
  margin-left: 0.38rem;
  svg {
    fill: ${(props) => (props.disabled ? COLORS.LT_GREY : COLORS.WHITE)};
    height: 0.56rem;
    width: 0.56rem;
  }
`

const OptOutText = ({
  privacyPolicyLink = 'https://www.wildskymedia.com/privacy-policy/',
  sendRequestLink = 'https://privacyportal-cdn.onetrust.com/dsarwebform/c932354f-213d-43fb-8919-af488348bf01/8d995c75-cfbe-4235-ab28-2bbae595d1bf.html',
}) => {
  return (
    <ScOptOutText>
      If you’re concerned about your data, please review our privacy policy{' '}
      <ScOptOutLink to={privacyPolicyLink} withDefaultStyle={false}>
        here
      </ScOptOutLink>
      , or send us a request for data access or deletion{' '}
      <ScOptOutLink to={sendRequestLink} withDefaultStyle={false}>
        here
      </ScOptOutLink>
      .
    </ScOptOutText>
  )
}

const ContactUsForm = (props) => {
  return (
    <Layout>
      <DocumentHead title='Contact Us' />
      <ScFlexWrapper className='noskimlinks'>
        <ScHeader>CONTACT US</ScHeader>
        <OptOutText />
        <Formik
          initialValues={contactUsValues}
          validate={(values) => contactUsValidator(values)}
          onSubmit={(values) => {
            sendEmail(values)
            props.onSuccess()
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
                <ScLabel>Select a Contact</ScLabel>
                <SelectField
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.contactCategory}
                  name='contactCategory'
                  errMsg={errors.contactCategory}
                  touchState={
                    touched.contactCategory
                      ? errors.contactCategory
                        ? TOUCH_STATE.TOUCHED_ERR
                        : TOUCH_STATE.TOUCHED_NO_ERR
                      : TOUCH_STATE.UNTOUCH
                  }
                  options={[
                    { value: 'general-inquiry', label: 'General Inquiry' },
                    { value: 'editorial', label: 'Editorial' },
                    { value: 'technical-support', label: 'Technical Support' },
                    { value: 'careers', label: 'Careers' },
                    {
                      value: 'business-partner-ad',
                      label: 'Business, Partnerships & Advertising',
                    },
                    { value: 'press', label: 'Press' },
                    { value: 'rights-licensing', label: 'Rights & Licensing' },
                  ]}
                />
                <ScLabel>Subject</ScLabel>
                <InputField
                  type='text'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.subject}
                  name='subject'
                  placeholder='How can we help?'
                  errMsg={errors.subject}
                  touchState={
                    touched.subject
                      ? errors.subject
                        ? TOUCH_STATE.TOUCHED_ERR
                        : TOUCH_STATE.TOUCHED_NO_ERR
                      : TOUCH_STATE.UNTOUCH
                  }
                />
                <ScLabel>
                  Name <ScOptionalText>(optional)</ScOptionalText>
                </ScLabel>
                <InputField
                  type='text'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.fullName}
                  name='fullName'
                  placeholder='Your name'
                  errMsg={errors.fullName}
                  touchState={
                    touched.fullName
                      ? errors.fullName
                        ? TOUCH_STATE.TOUCHED_ERR
                        : TOUCH_STATE.TOUCHED_NO_ERR
                      : TOUCH_STATE.UNTOUCH
                  }
                />
                <ScLabel>E-mail</ScLabel>
                <InputField
                  type='email'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  name='email'
                  placeholder='name@domain.com'
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
                  Phone <ScOptionalText>(optional)</ScOptionalText>
                </ScLabel>
                <InputField
                  type='tel'
                  onChange={(event) =>
                    setFieldValue(
                      'phone',
                      autoCompleteUsPhoneNumber(event.target.value)
                    )
                  }
                  onBlur={handleBlur}
                  value={values.phone}
                  name='phone'
                  placeholder='i.e. xxx-xxx-xxxx'
                  errMsg={errors.phone}
                  touchState={
                    touched.phone
                      ? errors.phone
                        ? TOUCH_STATE.TOUCHED_ERR
                        : TOUCH_STATE.TOUCHED_NO_ERR
                      : TOUCH_STATE.UNTOUCH
                  }
                />
                <ScLabel>Comments/Questions</ScLabel>
                <TextAreaField
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.question}
                  name='question'
                  placeholder='Add your comments here'
                  errMsg={errors.question}
                  touchState={
                    touched.question
                      ? errors.question
                        ? TOUCH_STATE.TOUCHED_ERR
                        : TOUCH_STATE.TOUCHED_NO_ERR
                      : TOUCH_STATE.UNTOUCH
                  }
                />
                {/* TODO: We need to implement the option to enable right arrow icon in refactoring project */}
                <SubmitButton type='submit' disabled={!isValid}>
                  SUBMIT
                  <ScImageBox disabled={!isValid}>
                    <IconNavLeft />
                  </ScImageBox>
                </SubmitButton>
              </form>
            )
          }}
        />
      </ScFlexWrapper>
    </Layout>
  )
}

ContactUsForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
}

export default ContactUsForm
