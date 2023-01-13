import isEmpty from 'lodash/isEmpty'

export const contactUsValues = {
  contactCategory: 'general-inquiry',
  subject: '',
  fullName: '',
  email: '',
  phone: '',
  question: '',
}

export const rsvpValues = {
  firstName: '',
  lastName: '',
  email: '',
  dueDate: '',
  parentalStatus: '',
  birthDate: '',
  zipCode: '',
}

export const subscribeValues = {
  email: '',
  birthdate: '',
  parentalStatus: '',
  dueDate: '',
  preferredLanguage: '',
}

export const autoCompleteUsPhoneNumber = phoneNumber => {
  let computedNumber = []
  phoneNumber = phoneNumber.match(/[0-9]/g)

  if (phoneNumber === null) return ''

  phoneNumber = phoneNumber.join('').substring(0, 10)
  const currentSize = phoneNumber.length
  while (phoneNumber.length > 3) {
    computedNumber.push(phoneNumber.substring(0, 3))
    phoneNumber = phoneNumber.substring(3, phoneNumber.length)
    if (phoneNumber.length === 4 && currentSize === 10) break
  }
  if (phoneNumber.length > 0) {
    computedNumber.push(phoneNumber)
  }
  return computedNumber.join('-')
}

export const calculatePregnancyWeek = dueDateStr => {
  // How to calculate week of pregnancy
  //    - Week of pregnancy = days into pregnancy / 7 days
  //    - Days into pregnancy = today - start date
  //    - Start date = due date - 280 days
  const dueDateValue = new Date(`${dueDateStr}`).getTime()
  const startDateValue = dueDateValue - 280 * 24 * 60 * 60 * 1000
  const nowValue = Date.now()
  const daysIntoPregnancy = Math.floor((nowValue - startDateValue) / 1000 / 60 / 60 / 24)
  const weekOfPregnancy = Math.ceil(daysIntoPregnancy / 7)
  return weekOfPregnancy
}

export const isValidEmail = email => {
  return email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
}

export const isValidUsZipcode = zipcode => {
  // expected format = 'ddddd' or 'ddddd-dddd'
  return zipcode && /^\d{5}(-\d{4})?$/.test(zipcode)
}

export const isValidUsDateFormat = dateStr => {
  if (!dateStr) {
    return true
  }

  // expected format = 'MM/DD/YYYY' and year is between 19XX to 20XX
  let dateRegExp = /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/((?:19|20)[0-9]{2})$/
  let regExpExecArray = dateRegExp.exec(dateStr)
  if (!regExpExecArray) {
    return false
  }

  let monthStr = regExpExecArray[1]
  let dayOfMonthStr = regExpExecArray[2]
  let yearStr = regExpExecArray[3]

  if (monthStr === '02') {
    if (['30', '31'].includes(dayOfMonthStr)) {
      return false
    } else if (
      dayOfMonthStr === '29' && // 29th Feb only valid on leap year only
      !(yearStr % 100 === 0 ? yearStr % 400 === 0 : yearStr % 4 === 0)
    ) {
      return false
    }
  } else if (dayOfMonthStr === '31' && ['04', '06', '09', '11'].includes(monthStr)) {
    return false
  }
  return true
}

export const isAgeMoreThan = (birthdateStr, expectedAge) => {
  let birthdate = new Date(`${birthdateStr}`)
  let now = new Date()

  if (now.getFullYear() - birthdate.getFullYear() > expectedAge) {
    return true
  } else if (now.getFullYear() - birthdate.getFullYear() === expectedAge) {
    if (now.getMonth() - birthdate.getMonth() > 0) {
      return true
    } else if (
      now.getMonth() - birthdate.getMonth() === 0 &&
      now.getDate() - birthdate.getDate() >= 0
    ) {
      return true
    }
  }
  return false
}

export const isValidDueDate = dueDateStr => {
  // Valid due date is due date that when calculate week of pregnancy,
  // it return number between 1-42
  const weekOfPregnancy = calculatePregnancyWeek(dueDateStr)
  if (weekOfPregnancy >= 1 && weekOfPregnancy <= 42) {
    return true
  }
  return false
}

export const contactUsValidator = (values, customErrorMessage = null) => {
  //site can pass in custom error message to replace default error message
  let errors = {}
  if (!values.contactCategory) {
    if (!customErrorMessage) errors.contactCategory = 'Please select a contact from the list above.'
    else errors.contactCategory = customErrorMessage.contactCategory
  }
  if (!values.subject) {
    if (!customErrorMessage) errors.subject = 'Please include a subject.'
    else errors.subject = customErrorMessage.subject
  }
  if (!isValidEmail(values.email)) {
    if (!customErrorMessage) errors.email = 'Please enter a valid e-mail address.'
    else errors.email = customErrorMessage.email
  }
  if (values.phone && !/^([0-9]{3})+(-[0-9]{3})+-[0-9]{4}$/.test(values.phone)) {
    if (!customErrorMessage) errors.phone = 'Please enter a valid phone number.'
    else errors.phone = customErrorMessage.phone
  }
  if (!values.question) {
    if (!customErrorMessage) errors.question = 'Please enter your comments or questions.'
    else errors.question = customErrorMessage.question
  }
  return errors
}

export const rsvpValidator = (values, customErrorMessage = null) => {
  //site can pass in custom error message to replace default error message
  let errors = {}
  if (!values.firstName) {
    if (!customErrorMessage) errors.firstName = 'Please enter your first name.'
    else errors.firstName = customErrorMessage.firstName
  }
  if (!values.lastName) {
    if (!customErrorMessage) errors.lastName = 'Please enter your last name.'
    else errors.lastName = customErrorMessage.lastName
  }
  if (!isValidEmail(values.email)) {
    if (!customErrorMessage) errors.email = 'Please enter a valid e-mail address.'
    else errors.email = customErrorMessage.email
  }
  if (!values.parentalStatus) {
    if (!customErrorMessage) errors.parentalStatus = 'Please select an answer.'
    else errors.parentalStatus = customErrorMessage.parentalStatus
  }
  if (!values.dueDate) {
    if (!customErrorMessage) errors.dueDate = "Please enter your due date or baby's birthdate."
    else errors.dueDate = customErrorMessage.dueDate
  }
  return errors
}

export const subscribeValidator = (values, options) => {
  const defaultOptions = { expectedAge: 18, customErrorMessage: {} }
  const { expectedAge, customErrorMessage } = { ...defaultOptions, ...options }

  // site can pass in custom error message to replace default error message
  let errors = {}
  if (!isValidEmail(values.email)) {
    if (!customErrorMessage.emailInvalid) errors.email = 'Please enter a valid e-mail address.'
    else errors.email = customErrorMessage.emailInvalid
  }

  if (values.birthdate) {
    if (/^\d{8}$/.test(values.birthdate)) {
      // auto change MMDDYYYY to MM/DD/YYYY
      values.birthdate =
        `${values.birthdate.slice(0, 2)}/` +
        `${values.birthdate.slice(2, 4)}/${values.birthdate.slice(4, 8)}`
    }
    if (!isValidUsDateFormat(values.birthdate)) {
      if (!customErrorMessage.dateInvalidFormat)
        errors.birthdate = 'Please enter a valid date format "MM/DD/YYYY".'
      else errors.birthdate = customErrorMessage.dateInvalidFormat
    } else {
      if (!isAgeMoreThan(values.birthdate, expectedAge)) {
        if (!customErrorMessage.belowExpectedAge)
          errors.birthdate = `You are underage, please come visit us once you are ${expectedAge}.`
        else errors.birthdate = customErrorMessage.belowExpectedAge
      }
    }
  }

  if (isEmpty(values.parentalStatus)) {
    if (!customErrorMessage.parentalStatusNotSelect)
      errors.parentalStatus = 'Please choose a parental status.'
    else errors.parentalStatus = customErrorMessage.parentalStatusNotSelect
  }
  if (values.parentalStatus.includes('Pregnant') && !values.dueDate) {
    if (!customErrorMessage.dueDateNotSelect) errors.dueDate = 'Please enter your due date.'
    else errors.dueDate = customErrorMessage.dueDateNotSelect
  }
  if (values.dueDate) {
    if (/^\d{8}$/.test(values.dueDate)) {
      // auto change MMDDYYYY to MM/DD/YYYY
      values.dueDate =
        `${values.dueDate.slice(0, 2)}/` +
        `${values.dueDate.slice(2, 4)}/${values.dueDate.slice(4, 8)}`
    }
    if (!isValidUsDateFormat(values.dueDate)) {
      if (!customErrorMessage.dateInvalidFormat)
        errors.dueDate = 'Please enter a valid date format "MM/DD/YYYY".'
      else errors.dueDate = customErrorMessage.dateInvalidFormat
    } else {
      if (!isValidDueDate(values.dueDate)) {
        if (!customErrorMessage.dueDateInvalidRange)
          errors.dueDate = 'Please enter a valid due date.'
        else errors.dueDate = customErrorMessage.dueDateInvalidRange
      }
    }
  }

  return errors
}

export const TOUCH_STATE = {
  UNTOUCH: 'Untouch',
  TOUCHED_ERR: 'Touched and there is an error',
  TOUCHED_NO_ERR: 'Touched without any error',
}
