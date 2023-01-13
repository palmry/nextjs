import axios from 'axios'
import crypto from 'crypto'

const publicURL = `${process.env.PUBLIC_URL}/.netlify/functions`
const apiKey = process.env.REACT_APP_REST_API_KEY

function generateSignature(payload) {
  const strToken = Object.keys(payload).reduce((result, key) => result + payload[key] + '|', '')
  const hash = crypto
    .createHmac('sha256', apiKey)
    .update(strToken)
    .digest('hex')
  return hash
}

export function sendEmail(payload) {
  return axios.post(`${publicURL}/sendEmail`, {
    ...payload,
    sig: generateSignature(payload),
  })
}

export function addWebinarRegistrant(payload) {
  return axios.post(`${publicURL}/addWebinarRegistrant`, {
    ...payload,
    sig: generateSignature(payload),
  })
}
