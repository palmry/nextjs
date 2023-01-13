import axios from 'axios'
import { getProp30 } from 'wsc/utils/googleTagManager'
import { utmContent, utmSource } from 'wsc/utils/utmValues'
const get = require('lodash/get')

export function listSubscribe(email, data = {}) {
  const prop30 = getProp30()
  const pageType = get(prop30, 'pageType', '')
  axios({
    method: 'post',
    url: 'https://api.iterable.com/api/lists/subscribe',
    data: {
      listId: Number(process.env.REACT_APP_ITERABLE_LIST_ID),
      subscribers: [
        {
          email: email,
          dataFields: {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            signupSource: pageType,
            utm_content: utmContent ? utmContent : undefined,
            utm_source: utmSource ? utmSource : undefined,
            ...data,
          },
          preferUserId: true,
          mergeNestedObjects: true,
        },
      ],
    },
    headers: {
      'api-key': process.env.REACT_APP_ITERABLE_API_KEY,
      'Content-Type': 'application/json',
    },
  })
}
