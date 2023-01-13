const axios = require('axios')
const path = require('path')
const utils = require(path.resolve(process.cwd(), './src/builder/utils'))

const ROOT_PATH = path.resolve(process.cwd(), `./src/statics/configs`)
const EXPORT_FILE_NAME = 'instagram.json'
const INSTAGRAM_TOKEN = process.env.INSTAGRAM_TOKEN_NEW
const SCRIPT_NAME = path.basename(__filename)
const INSTAGRAM_API = 'https://graph.instagram.com'

async function refreshToken() {
  return axios.get(`${INSTAGRAM_API}/refresh_access_token`, {
    params: {
      grant_type: 'ig_refresh_token',
      access_token: INSTAGRAM_TOKEN,
    },
  })
}

async function main() {
  try {
    await refreshToken()
    axios
      .get(
        `${INSTAGRAM_API}/v1.0/me/media?fields=thumbnail_url,permalink,media_url&access_token=${INSTAGRAM_TOKEN}`
      )
      .then(function(response) {
        const formatedResult = response.data.data.slice(0, 3).map(item => {
          return {
            image: item.thumbnail_url || item.media_url,
            url: item.permalink,
          }
        })
        utils.writeFile(
          ROOT_PATH,
          EXPORT_FILE_NAME,
          JSON.stringify(formatedResult),
          EXPORT_FILE_NAME
        )
      })
  } catch (e) {
    console.trace(`[${SCRIPT_NAME}] `, e.stack)
    utils.writeFile(ROOT_PATH, EXPORT_FILE_NAME, JSON.stringify({}), EXPORT_FILE_NAME)
  }
}

module.exports = main
