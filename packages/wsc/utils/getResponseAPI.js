import axios from 'axios'
import { getProp30 } from './googleTagManager'
import { utmContent, utmSource } from './utmValues'
const get = require('lodash/get')
const isArray = require('lodash/isArray')

const proxyURL = `${process.env.PUBLIC_URL}/api/newsletter`

const CUSTOM_FIELD_MAPPING = {
  age_of_child: 'lc1',
  birthdate: 'lYT',
  due_date: 'lGZ',
  main_category: 'lY0',
  parental_status: 'lYu',
  postal_code: 'lYf',
  preferred_language: 'lcE',
  pregnancy_week: 'lcN',
  related_category: 'lYV',
  signup_source: 'lYX',
  time_zone: 'lcf',
  utm_content: 'lY2',
  utm_source: 'lYA',
  webinar_registrant: 'lcC',
  opt_out: 'lcP',
  newsletter_format: 'lcm',
  childs_birthday: 'lcs',
  topic_of_interest: 'lck',
  parental_status_checkboxes: 'lc8',
}

const TAG_MAPPING = {
  MC_pregnancy_week_1: 'q',
  MC_pregnancy_week_2: 'o',
  MC_pregnancy_week_3: 't',
  MC_pregnancy_week_4: 'w',
  MC_pregnancy_week_5: 'T',
  MC_pregnancy_week_6: '1',
  MC_pregnancy_week_7: 'a',
  MC_pregnancy_week_8: 'y',
  MC_pregnancy_week_9: 'f',
  MC_pregnancy_week_10: 'J',
  MC_pregnancy_week_11: 'Q',
  MC_pregnancy_week_12: 'j',
  MC_pregnancy_week_13: 'd',
  MC_pregnancy_week_14: 'Z',
  MC_pregnancy_week_15: '7',
  MC_pregnancy_week_16: 'O',
  MC_pregnancy_week_17: 'h',
  MC_pregnancy_week_18: 'x',
  MC_pregnancy_week_19: '3',
  MC_pregnancy_week_20: 'p',
  MC_pregnancy_week_21: '5',
  MC_pregnancy_week_22: '0',
  MC_pregnancy_week_23: 'V',
  MC_pregnancy_week_24: 'X',
  MC_pregnancy_week_25: '6',
  MC_pregnancy_week_26: '2',
  MC_pregnancy_week_27: 'A',
  MC_pregnancy_week_28: 'F',
  MC_pregnancy_week_29: 'I',
  MC_pregnancy_week_30: 'i',
  MC_pregnancy_week_31: 'S',
  MC_pregnancy_week_32: 'N',
  MC_pregnancy_week_33: 'r',
  MC_pregnancy_week_34: 'R',
  MC_pregnancy_week_35: 'E',
  MC_pregnancy_week_36: 'n',
  MC_pregnancy_week_37: 'K',
  MC_pregnancy_week_38: 'C',
  MC_pregnancy_week_39: 'P',
  MC_pregnancy_week_40: 'm',
  MC_pregnancy_week_41: 'k',
  MC_pregnancy_week_42: 's',
}

export const MC_PREGNANCY_WEEK_TAG_PREFIX = 'MC_pregnancy_week_'
const MC_PREGNANCY_WEEK_TAG_REGEXP = /^MC_pregnancy_week_\d+$/

const getCustomFieldIdFromCustomFieldName = customFieldName => {
  if (customFieldName in CUSTOM_FIELD_MAPPING) {
    return CUSTOM_FIELD_MAPPING[customFieldName]
  }
  throw new Error(`Can't get id for custom field '${customFieldName}'`)
}

export const createCustomFieldObject = (customFieldName, value) => {
  return {
    customFieldId: getCustomFieldIdFromCustomFieldName(customFieldName),
    value: isArray(value) ? value : [value],
  }
}

const customFieldsArray = (customFields = []) => {
  const prop30 = getProp30()
  const pageType = get(prop30, 'pageType', '')

  return [
    createCustomFieldObject('utm_content', utmContent),
    createCustomFieldObject('utm_source', utmSource),
    createCustomFieldObject('signup_source', pageType),
    createCustomFieldObject('time_zone', Intl.DateTimeFormat().resolvedOptions().timeZone),
    ...customFields,
  ].filter(field => field.value[0])
}

export const listSubscribe = async (
  name,
  email,
  customFields = [],
  dayOfCycle = null,
  getResponseListToken = null,
  tagNames = []
) => {
  const data = {
    email: email,
    campaign: {
      campaignId: getResponseListToken || process.env.REACT_APP_GET_RESPONSE_LIST_TOKEN,
    },
    customFieldValues: customFieldsArray(customFields),
    tags: [],
  }
  if (name) {
    data.name = name
  }
  if (dayOfCycle !== null) {
    data.dayOfCycle = dayOfCycle
  }
  for (const tagName of tagNames) {
    const tagId = TAG_MAPPING[tagName]
    if (!tagId) {
      console.error(`Cannot get tagId from tagName "${tagName}"`)
      continue
    }
    data.tags.push({ tagId })
  }

  const response = await axios({
    method: 'post',
    url: `${proxyURL}/contacts`,
    data: data,
  })

  return response
}

const findContact = async (email, getResponseListToken = null) => {
  return await axios({
    method: 'get',
    url: `${proxyURL}/campaigns/${getResponseListToken ||
      process.env.REACT_APP_GET_RESPONSE_LIST_TOKEN}/contacts`,
    params: {
      'query[email]': email,
    },
  })
}

const getContact = async contactId => {
  return await axios({
    method: 'get',
    url: `${proxyURL}/contacts/${contactId}`,
  })
}

const customFieldsArrayForUpdate = (customFields = [], existingCustomFields = []) => {
  // Ignore these fields to keep the data when the user subscribe at the first time
  const filteredCustomField = customFields.filter(
    field =>
      ![
        CUSTOM_FIELD_MAPPING['main_category'],
        CUSTOM_FIELD_MAPPING['related_category'],
        CUSTOM_FIELD_MAPPING['webinar_registrant'],
        CUSTOM_FIELD_MAPPING['signup_source'],
      ].includes(field.customFieldId)
  )

  return [
    ...existingCustomFields,
    createCustomFieldObject('time_zone', Intl.DateTimeFormat().resolvedOptions().timeZone),
    ...filteredCustomField,
  ].filter(field => field.value[0])
}

const tagsForUpdate = (tagNames, existingTags) => {
  // check this contact has existing pregnancyWeekTag or not
  let hasExistingPregnancyWeekTag = false
  for (const existingTag of existingTags) {
    if (existingTag.name.match(MC_PREGNANCY_WEEK_TAG_REGEXP)) {
      hasExistingPregnancyWeekTag = true
      break
    }
  }

  // mapping tagName to tagId for new tags
  let hasNewPregnancyWeekTag = false
  const newTags = []
  for (const tagName of tagNames) {
    const tagId = TAG_MAPPING[tagName]
    if (!tagId) {
      console.error(`Cannot get tagId from tagName "${tagName}"`)
      continue
    }
    newTags.push({ tagId })
    if (hasNewPregnancyWeekTag === false && tagName.match(MC_PREGNANCY_WEEK_TAG_REGEXP)) {
      hasNewPregnancyWeekTag = true
    }
  }

  // avoid multiple pregnancy week tag for each contacts when update
  let filteredExistingTags = existingTags
  if (hasExistingPregnancyWeekTag && hasNewPregnancyWeekTag) {
    filteredExistingTags = existingTags.filter(tag => !tag.name.match(MC_PREGNANCY_WEEK_TAG_REGEXP))
  }

  return [...filteredExistingTags, ...newTags]
}

const updateContact = async (
  id,
  name,
  email,
  customFields = [],
  existingCustomFields = [],
  dayOfCycle = null,
  getResponseListToken = null,
  tagNames = [],
  existingTags = []
) => {
  let data = {
    email: email,
    campaign: {
      campaignId: getResponseListToken || process.env.REACT_APP_GET_RESPONSE_LIST_TOKEN,
    },
    customFieldValues: customFieldsArrayForUpdate(customFields, existingCustomFields),
    tags: tagsForUpdate(tagNames, existingTags),
  }
  if (name) {
    data.name = name
  }
  if (dayOfCycle !== null) {
    data.dayOfCycle = dayOfCycle
  }

  return await axios({
    method: 'post',
    url: `${proxyURL}/contacts/${id}`,
    data: data,
  })
}

export const getAndUpdateContact = async (
  name,
  email,
  customFields,
  dayOfCycle = null,
  getResponseListToken = null,
  tagNames = []
) => {
  const contactId = await findContact(email, getResponseListToken).then(response => {
    return response.data[0].contactId
  })

  const [existingCustomFields, existingTags] = await getContact(contactId).then(response => {
    return [response.data.customFieldValues, response.data.tags]
  })

  return await updateContact(
    contactId,
    name,
    email,
    customFields,
    existingCustomFields,
    dayOfCycle,
    getResponseListToken,
    tagNames,
    existingTags
  )
}
