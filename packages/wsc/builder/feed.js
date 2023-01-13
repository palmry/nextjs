/* eslint-disable no-template-curly-in-string */
const path = require('path')
const RSS = require('rss')
const marked = require('marked')
const template = require('lodash/template')
const has = require('lodash/has')
const get = require('lodash/get')
const isEmpty = require('lodash/isEmpty')
const isArray = require('lodash/isArray')
const isString = require('lodash/isString')
const isObject = require('lodash/isObject')
const siteConfig = require(path.resolve(process.cwd(), `./src/configs/appRaw.js`))
const utils = require('../../bin/utils')
const contentful = require('../utils/contentfulAPI')
const number = require('../utils/number')
const localization = require('./localization')
const querystring = require('querystring')
const twitter = require('../utils/twitterAPI')
const youtube = require('../utils/youtubeAPI')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

require('dotenv').config({
  path: path.resolve(process.cwd(), `./.env.${process.env.NODE_ENV}`),
})

// This build script is implemented based on function composition concept
// Please try to understand it before starting to work here.

/*----------------------------------------------------------------------------------
 *  DEFAULT CONSTANT
 *---------------------------------------------------------------------------------*/

let dateTime = new Date()
dateTime.setHours(dateTime.getHours(), 0, 0, 0)
const CURRENT_DATETIME = dateTime.toISOString()

const FEED_ROOT_PATH = path.resolve(process.cwd(), `./public/feed`)

const SCRIPT_NAME = path.basename(__filename)

const MSN_SUPPORTED_FILTER = /twitter\.com|instagram\.com|facebook\.com|youtu/g
const NATIVE_EMBED_FILTER = /<blockquote|<iframe/g
const EMBEDLY_TYPE_SETTINGS = [
  {
    domType: 'a',
    attributeName: 'href',
  },
]

// TODO: This should be refactored so we can require config/ads.txt
// to get the au1 value so it doesn't need to be maintained in two places.
// The reason I didn't do it now is because ads.js requires refactoring in order,
// to import into this file which is out of the scope of this ticket
const AU1_CONFIGS = [
  {
    name: 'Mom.com',
    au1: '008_MomMe',
  },
  {
    name: 'CafeMom.com',
    au1: '001_CafeMom',
  },
  {
    name: 'MamasLatinas.com',
    au1: '002_Mamaslatinas',
  },
]

/*----------------------------------------------------------------------------------
 *  SHARED FUNCTION
 *---------------------------------------------------------------------------------*/

function getFeedOption(locale) {
  if (locale === 'all') locale = 'en'

  const description =
    localization.getText(`${locale}.feed.description`) ||
    localization.getText(`${locale}.global.appDescription`)

  return {
    title: localization.getText(`${locale}.feed.title`),
    language: locale,
    site_url: siteConfig.url,
    description: description,
    ttl: 15,
    custom_elements: [
      { 'snf:logo': [{ url: `${siteConfig.url}/images/logo/logo-290x50.png` }] },
      { 'snf:darkModeLogo': [{ url: `${siteConfig.url}/images/logo/logo-dark-290x50.png` }] },
    ],
    custom_namespaces: {
      media: 'http://search.yahoo.com/mrss/',
      dc: 'http://purl.org/dc/elements/1.1/',
      snf: 'http://www.smartnews.be/snf',
    },
  }
}

function buildMediaContent(image) {
  return {
    _attr: {
      url: get(image, 'url', '').replace(
        '//images.ctfassets.net/',
        'https://images.ctfassets.net/'
      ),
      type: get(image, 'contentType', ''),
      medium: 'image',
    },
  }
}

function isProductSlide(slide) {
  return has(slide, 'productLink') && has(slide, 'storeName') && has(slide, 'price')
}

function generatedShopContent(slide, locale = 'en') {
  const replacement = {
    productLink: slide.productLink,
    storeName: slide.storeName,
    price: number.priceFormat(slide.price),
  }
  const compiled = template(localization.getText(`${locale}.feed.buy`))
  return compiled(replacement)
}

function buildSlideData(entry, image, postLanguage) {
  const locale = Object.keys(localization.CONTENTFUL_POST_LOCALE_KEYWORDS).find(
    key => localization.CONTENTFUL_POST_LOCALE_KEYWORDS[key] === postLanguage
  )
  const shopContent = isProductSlide(entry) ? generatedShopContent(entry, locale) : ''
  let encodedContent = (has(entry, 'content') && marked(entry.content)) || ''
  encodedContent = shopContent + encodedContent
  return [
    buildMediaContent(image),
    {
      'media:title': get(entry, 'title', ''),
    },
    {
      'media:description': encodedContent,
    },
    {
      'media:credit': get(image, 'description', ''),
    },
    {
      embed: get(entry, 'embedImage', ''),
    },
  ]
}

function getMainCategory(post) {
  return get(post, 'mainCategory.slug', '')
}

function encodePostContent(post) {
  return (
    (has(post, 'content') &&
      marked(
        post.content.replace(/\(\/\/images.ctfassets.net\//g, '(https://images.ctfassets.net/')
      )) ||
    ''
  )
}

function encodePostContentCombineWithGallery(post) {
  const postContentHtml = encodePostContent(post)

  const gallerySlidesHtml = getGallerySlide(post).map(gallerySlide => {
    if (gallerySlide) {
      const { image } = gallerySlide
      const slideData = buildSlideData(gallerySlide, image, post.language)

      const slideImageCredit = slideData[3]['media:credit']
      const slideImageCreditHtml = slideImageCredit
        ? `<cite style="text-align: right; display: block;">${slideImageCredit}</cite>`
        : ''

      const slideImage = slideData[0]._attr.url
      const slideImageHtml = slideImage
        ? `<p><img src="${slideImage}" />${slideImageCreditHtml}</p>`
        : ''

      const slideEmbed = slideData[4]['embed']
      const slideEmbedHtml = slideEmbed ? `<p>${slideEmbed}</p>` : ''

      const slideTitleHtml = `<h3>${slideData[1]['media:title']}</h3>`
      const slideContentHtml = slideData[2]['media:description']

      return `${slideImageHtml}${slideEmbedHtml}${slideTitleHtml}${slideContentHtml}`
    }
    return ''
  })

  return `${postContentHtml}${postContentHtml && '<br>'}${gallerySlidesHtml.join('<br>')}`
}

function convertContentfulImageGifToJpeg(contentfulImage) {
  if (contentfulImage.contentType === 'image/gif') {
    contentfulImage.url = contentfulImage.url + '?fm=jpg'
    contentfulImage.contentType = 'image/jpeg'
  }
  return contentfulImage
}

function buildArticleFeaturedImage(featuredImage) {
  return {
    'media:content': [
      buildMediaContent(featuredImage),
      {
        'media:title': get(featuredImage, 'title', ''),
      },
    ],
  }
}

function buildArticleFeaturedImageThumbnail(featuredImage) {
  return {
    'media:thumbnail': [buildMediaContent(featuredImage)],
  }
}

function createFeedItem(post, extraPostUrlParams = null) {
  return {
    title: post.title,
    description: post.seoDescription,
    url: `${siteConfig.url}/${getMainCategory(post)}/${post.slug}${
      extraPostUrlParams ? '?' + querystring.stringify(extraPostUrlParams) : ''
    }`, // https://mom.com/mainCategory/slug
    guid: post.sys.id,
    date: contentful.fixDate(post.publishDate),
    author: post.authors.map(author => author.name).join(),
  }
}

function getGallerySlide(post) {
  return get(post, 'gallerySlides', [])
}

function hasFeatureImageInAllSlides(gallerySlides) {
  const emptySlides = gallerySlides.find(slide => get(slide, 'image.url', '') === '')
  return isEmpty(emptySlides)
}

function buildMSNFirstSlide(post) {
  // convert the first frame of gif to jpg.
  post.featuredImage = convertContentfulImageGifToJpeg(post.featuredImage)

  const { featuredImage, language, ...restProps } = post

  // We cannot use post.title because the topic will duplicate with page title at the first slide.
  // And we also cannot use featureImage.title because it displays the image name which does not relate to the content.
  // So, we leave as blank value to match with our website.
  restProps.title = ''

  // Add a post feature image as the first gallery slide.
  return buildSlideData(restProps, featuredImage, language)
}

function generateRSSArticleFeed(post, getModifiedDateFunc = null) {
  const newFeedItem = createFeedItem(post)
  newFeedItem.custom_elements = []

  newFeedItem.custom_elements.push({
    'content:encoded': { _cdata: encodePostContent(post) },
  })
  if (getModifiedDateFunc !== null) {
    newFeedItem.custom_elements.push(getModifiedDateFunc(post.sys.updatedAt))
  }

  if (post.featuredImage) {
    post.featuredImage = convertContentfulImageGifToJpeg(post.featuredImage)
    newFeedItem.custom_elements.push(buildArticleFeaturedImage(post.featuredImage))
  }
  return newFeedItem
}

function generateRSSGalleryFeed(post, firstSlideBuilderFunc = null, getModifiedDateFunc = null) {
  const gallerySlides = getGallerySlide(post)
  const newFeedItem = createFeedItem(post)
  const mediaGroup = []
  newFeedItem.custom_elements = []
  if (!hasFeatureImageInAllSlides(gallerySlides)) return null

  if (getModifiedDateFunc !== null) {
    newFeedItem.custom_elements.push(getModifiedDateFunc(post.sys.updatedAt))
  }

  if (firstSlideBuilderFunc !== null) {
    // We need to add the post content into the first slide for MSN Feed only.
    mediaGroup.push(firstSlideBuilderFunc(post))
  } else {
    // We will push the post content to main context if there is no first slide builder to support Tribune Distribution.
    // Because it is required field.
    newFeedItem.custom_elements.push({
      'content:encoded': { _cdata: encodePostContent(post) },
    })
    // Convert the feature image from gif to jpeg.
    post.featuredImage = convertContentfulImageGifToJpeg(post.featuredImage)
    newFeedItem.custom_elements.push(buildArticleFeaturedImage(post.featuredImage))
  }

  // Add other slides from gallerySlides list.
  gallerySlides.forEach(gallerySlide => {
    if (gallerySlide) {
      const { image } = gallerySlide
      mediaGroup.push(buildSlideData(gallerySlide, image, post.language))
    }
  })
  // add all slide by adding media:content
  mediaGroup.forEach(media => {
    newFeedItem.custom_elements.push({
      'media:content': media,
    })
  })
  return newFeedItem
}

function generatedTDModifiedDate(modifiedDate) {
  return {
    'dc:modified': new Date(modifiedDate).toUTCString(),
  }
}

function buildParamQueryFunctionsByLanguages(prototypeFuncs, languages) {
  return isEmpty(languages)
    ? { all: prototypeFuncs }
    : languages.reduce((funcSet, locale) => {
        const funcList = prototypeFuncs.map(func => {
          if (utils.isMultiLanguageSite(siteConfig)) {
            return buildQueryParamFunc(func, {
              'fields.language': localization.CONTENTFUL_POST_LOCALE_KEYWORDS[locale],
            })
          } else {
            return func
          }
        })
        funcSet[locale] = funcList
        return funcSet
      }, {})
}

// Apply HOC concept to extend function.
function buildQueryParamFunc(func, additionalParams) {
  return skip => {
    return func(skip) + `&` + querystring.stringify(additionalParams)
  }
}

function isSupportedByMSN(embedImage) {
  return isArray(embedImage.match(MSN_SUPPORTED_FILTER))
}

function shouldConvertToArticle(gallery) {
  // The slide will be embedly type if these condition are matched
  // 1. If some of embed image is supported by MSN, the content and image field should not be empty for other slides at least.
  // 2. If even one (some or all) slide in a gallery has a hidden slide title, that gallery should be sent to MSN as an article.
  // 3. If a gallery has some slides with no featured image or value in the embed image field, it should be sent to MSN as an article

  let validSlideCount = 0
  for (const slide of gallery.gallerySlides) {
    const embedImage = get(slide, 'embedImage', '')
    const hideTitle = get(slide, 'hideTitle', false)
    if (embedImage !== '') {
      // Check the embed image is supported by MSN.
      // Please see: https://partnerhub.msn.com/docs/spec/vcurrent/inline-social-embeds/BB7iGJ
      if (!isSupportedByMSN(embedImage)) {
        // We cannot settle this case to be true or false so we throw an error to skip this gallery.
        throw new Error(
          `This gallery (${gallery.slug}) cannot be in article.xml because the embed image in ${slide.slug} is not supported by MSN `
        )
      }
    }

    if (embedImage === '' && !hideTitle && has(slide, 'image')) {
      // Count the valid slide which is matched the specs in slide show.
      // Please see: https://partnerhub.msn.com/docs/example/vcurrent/example-rss-slideshow/AAsCx
      validSlideCount++
    }
  }
  return validSlideCount !== gallery.gallerySlides.length
}

function generateArticleContentBySlide(slide) {
  const imageUrl = get(slide, 'image.url', null)
  const title = get(slide, 'title', null)
  const content = get(slide, 'content', null)
  const embedImageData = get(slide, 'embedImageData', null)
  return `${isString(title) ? `<p><strong>${title}</strong></p>` : ``} 
    ${isString(imageUrl) ? `<p><img src="${imageUrl}" /></p>` : ``}
    ${isObject(embedImageData) ? `<p>${embedImageData.html}</p>` : ``} 
    ${isString(content) ? `<p>${content}</p>` : ``}`
}

function getSrcURLfromEmbedImage(embedImage) {
  let url = null
  try {
    const dom = new JSDOM(embedImage)
    EMBEDLY_TYPE_SETTINGS.forEach(item => {
      try {
        if (isString(url)) return
        url = get(dom.window.document.querySelector(item.domType), item.attributeName, null)
      } catch (e) {
        console.error('Could not read embed image:', embedImage)
      }
    })
  } catch (e) {
    console.error('Could not read embed image:', embedImage)
  }
  return url
}

async function getOembedData(embedImage) {
  // Skip process if it contains a native embed code
  if (embedImage.match(NATIVE_EMBED_FILTER)) return { html: embedImage }

  let data = null
  try {
    let sourceURL = getSrcURLfromEmbedImage(embedImage)
    let response = null

    if (sourceURL.includes('twitter')) {
      const extractUrl = sourceURL.split('?')
      if (extractUrl.length > 0) {
        sourceURL = extractUrl[0]
      }
      response = await twitter.getEmbedData(sourceURL)
    } else if (sourceURL.includes('youtu')) {
      if (sourceURL.includes('embed')) {
        // Api does not support embed url so we need to convert it to watch url.
        sourceURL = sourceURL.replace('/embed/', '/watch?v=')
      }
      response = await youtube.getEmbedData(sourceURL)
    } else {
      // eslint-disable-next-line no-throw-literal
      console.error(`Unknown embed image:${embedImage}`)
    }
    if (response) data = response.data
  } catch (e) {
    console.error(`Could not load oembed for:${embedImage}`, e)
  }

  return data
}

async function convertSlideshowstoArticle(gallery) {
  let content = get(gallery, 'content', '')
  try {
    for (const slide of gallery.gallerySlides) {
      if (has(slide, 'embedImage')) {
        const embedImageData = await getOembedData(slide.embedImage)
        if (embedImageData) slide['embedImageData'] = embedImageData
        else return null
      }
      // Write the article content
      content += generateArticleContentBySlide(slide)
    }
  } catch (e) {
    return null
  }
  gallery['content'] = content
  return gallery
}

function tryToHideSlideTitle(gallery) {
  // Hide the slide title if the slide.hideTitle is true
  gallery.gallerySlides.forEach(slide => {
    const hideTitle = get(slide, 'hideTitle', false)
    if (hideTitle) delete slide.title
  })
}

/*----------------------------------------------------------------------------------
 *  RSS BUILDER FUNCTION
 *---------------------------------------------------------------------------------*/
const msnArticleFeedGenerator = async post => {
  if (post.postType === 'article') {
    return generateRSSArticleFeed(post)
  } else {
    // Convert gallery structure to article structure
    let article = null
    if (shouldConvertToArticle(post)) article = await convertSlideshowstoArticle(post)
    if (article) {
      return generateRSSArticleFeed(article)
    } else {
      return null
    }
  }
}

const msnGalleryFeedGenerator = async gallery => {
  let newFeedItem = null

  // Skip the post if some slide title is hidden.
  if (shouldConvertToArticle(gallery)) return newFeedItem

  newFeedItem = generateRSSGalleryFeed(gallery, buildMSNFirstSlide)
  return newFeedItem
}

const msnHomeTagFeedGenerator = async post => {
  const isArticle = post.postType === 'article'
  let newFeedItem = null
  if (isArticle) {
    newFeedItem = generateRSSArticleFeed(post)
  } else {
    if (shouldConvertToArticle(post)) {
      post = await convertSlideshowstoArticle(post)
      if (post) newFeedItem = generateRSSArticleFeed(post)
    } else {
      newFeedItem = generateRSSGalleryFeed(post, buildMSNFirstSlide)
    }
  }
  return newFeedItem
}

const tribuneDistributionFeedGenerator = async (post, { modifiedDateCreator }) => {
  const isArticle = post.postType === 'article'
  // skip an article if there is no content
  if (isArticle && !has(post, 'content')) return null
  // skip an article/gallery if there is sponsor in the main series (1st item of array)
  if (has(post, 'multipleSeries[0].sponsor')) return null

  // check sponsor from list of related categories
  const relatedCategories = get(post, 'relatedCategories', [])
  for (const category of relatedCategories) {
    if (category.sponsor) {
      return null
    }
  }
  // if sponsor is still not set then check sponsor from main category
  if (has(post, 'mainCategory.sponsor')) return null

  const newFeedItem = isArticle
    ? generateRSSArticleFeed(post, modifiedDateCreator)
    : generateRSSGalleryFeed(post, null, modifiedDateCreator)
  return newFeedItem
}

const rssFeedGenerator = async post => {
  // compose new rss data
  let newFeedItem = createFeedItem(post)

  newFeedItem['enclosure'] = get(post, 'featuredImage', null) && {
    url: 'https:' + post.featuredImage.url,
    size: post.featuredImage.details.size,
    type: post.featuredImage.contentType,
  }

  // move "author" key to custom elements because it automatically converts to <dc:creator> tag.
  newFeedItem.custom_elements = [{ author: { _cdata: newFeedItem.author } }]
  delete newFeedItem.author

  return newFeedItem
}

const appleNewsFeedGenerator = async post => {
  // compose new rss data
  const newFeedItem = {
    title: post.title,
    description: get(post, 'socialDescription', null) || post.seoDescription,
    url: `${siteConfig.url}/${post.mainCategory.slug}/${post.slug}?utm_source=AppleNews&amp;utm_medium=feed`,
    date: contentful.fixDate(post.publishDate),
  }

  if (post.featuredImage) {
    newFeedItem.custom_elements = [buildArticleFeaturedImageThumbnail(post.featuredImage)]
  }

  return newFeedItem
}

const fullContentFeedGenerator = (post, extraPostUrlParams = null) => {
  // TopBuzz Specification Document
  // https://www.topbuzz.com/rssArticleStandard
  const isArticle = post.postType === 'article' || post.postType === 'video article'

  // skip an article if there is no content
  if (isArticle && !has(post, 'content')) return null

  const newFeedItem = createFeedItem(post, extraPostUrlParams)

  newFeedItem.custom_elements = []

  let featuredImageHtml = ''
  if (post.featuredImage) {
    post.featuredImage = convertContentfulImageGifToJpeg(post.featuredImage)
    newFeedItem.custom_elements.push(buildArticleFeaturedImageThumbnail(post.featuredImage))

    const featuredImageCredit = `${get(post.featuredImage, 'description', '')}`
    const featuredImageCreditHtml = featuredImageCredit
      ? `<cite style="text-align: right; display: block;">${featuredImageCredit}</cite>`
      : ''

    featuredImageHtml = `<p><img src="${
      buildMediaContent(post.featuredImage)._attr.url
    }" />${featuredImageCreditHtml}</p>`
  }

  let combinedPostContent = `${featuredImageHtml}${encodePostContentCombineWithGallery(post)}`

  newFeedItem.custom_elements.push({
    'content:encoded': { _cdata: combinedPostContent },
  })

  return newFeedItem
}

const updayFeedGenerator = async post => {
  return await fullContentFeedGenerator(post, { utm_source: 'upday' })
}

const operaNewsFeedGenerator = async post => {
  return await fullContentFeedGenerator(post, { utm_source: 'opera' })
}

const smartViewFirstGenerator = async post => {
  let feedItem = await fullContentFeedGenerator(post)

  if (!feedItem) return

  const mainCategory = getMainCategory(post)
  const au1Config = AU1_CONFIGS.find(({ name }) => name === siteConfig.name)

  if (au1Config) {
    feedItem.custom_elements.push({
      'snf:analytics': {
        _cdata: `
          <script async src="https://www.googletagmanager.com/gtag/js?id=${
            process.env.GA_ID
          }"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GA_ID}',
              {
                'page_title': "${post.title.replace(/"/g, '\\"')}",
                'page_location': '${siteConfig.url}/${mainCategory}/${post.slug}',
                'page_referrer': 'https://www.smartnews.com/',
              }
            )
            gtag('config', '${process.env.GA4_ID}',
              {
                'page_title': "${post.title.replace(/"/g, '\\"')}",
                'page_location': '${siteConfig.url}/${mainCategory}/${post.slug}',
                'page_referrer': 'https://www.smartnews.com/',
              }
            )
          </script>
          <script>
            var _comscore = _comscore || [];
            _comscore.push({ c1: "2", c2: "${
              process.env.COMSCORE_ID
            }" , options: { url_append: "comscorekw=smartnews" }});
            (function() {
              var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
              s.src = "https://sb.scorecardresearch.com/cs/${process.env.COMSCORE_ID}/beacon.js";
              el.parentNode.insertBefore(s, el);
            })();
          </script>
          <noscript>
              <img src="https://sb.scorecardresearch.com/p?c1=2&c2=${
                process.env.COMSCORE_ID
              }&cv=3.6.0&cj=1&comscorekw=smartnews" />
          </noscript>
          <script>
            PARSELY = {
              autotrack: false,
              onload: function() {
                PARSELY.beacon.trackPageView({
                  url: '${siteConfig.url}/${mainCategory}/${post.slug}',
                  urlref: 'http://www.smartnews.com/'
                });
              }
            }
          </script>
          <script id="parsely-cfg" src="//cdn.parsely.com/keys/${
            process.env.PARSELY_SITE_ID
          }/p.js"></script>
        `,
      },
    })

    feedItem.custom_elements.push({
      'snf:advertisement': [
        {
          'snf:adcontent': {
            _attr: { id: 'div-gpt-ad-1601563454587-0' },
            _cdata: `
              <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
              <script>
                window.googletag = window.googletag || {cmd: []};
                googletag.cmd.push(function() {
                  googletag.defineSlot('/3051/${au1Config.au1}/au2/inApp_slot_1', [300, 250], 'div-gpt-ad-1601563454587-0').addService(googletag.pubads());
                  googletag.pubads().enableSingleRequest();
                  googletag.enableServices();
                });
              </script>
              <div id='div-gpt-ad-1601563454587-0' style='width: 300px; height: 250px;'>
                <script>
                  googletag.cmd.push(function() { googletag.display('div-gpt-ad-1601563454587-0'); });
                </script>
              </div>
            `,
          },
        },
      ],
    })
  }

  return feedItem
}

async function buildProcess(config) {
  try {
    const { paramQueryFunctions, languages = ['en'], alias, filename, buildFunc, ...rest } = config
    const localizedQueryParamFunctions = buildParamQueryFunctionsByLanguages(
      paramQueryFunctions,
      languages
    )
    const compileText = template(
      get(rest, 'rootPath', isArray(languages) ? FEED_ROOT_PATH + '/<%=locale%>' : FEED_ROOT_PATH)
    )

    for (const locale in localizedQueryParamFunctions) {
      const localQueryFuncs = localizedQueryParamFunctions[locale]
      const logHeader = alias + ` (${localization.CONTENTFUL_POST_LOCALE_KEYWORDS[locale]})`
      // fetch posts based on locale.
      let posts = []
      for (const queryParamFunc of localQueryFuncs) {
        posts = posts.concat(
          await contentful.fetchAllEntriesViaRestAPI(logHeader, queryParamFunc, true)
        )
      }
      // sort post by date descendent
      posts.sort((src, dest) => new Date(dest.publishDate) - new Date(src.publishDate))

      // Limit size of post
      const maxItemSize = get(rest, 'maxItem', 0)
      if (maxItemSize > 0) {
        posts = posts.slice(0, maxItemSize)
      }

      // build feed data.
      const feed = new RSS(getFeedOption(locale))
      for (const post of posts) {
        if (post.postType === 'gallery') {
          tryToHideSlideTitle(post)
        }
        let newFeedItem = null
        try {
          newFeedItem = await buildFunc(post, rest)
        } catch (error) {
          console.log(
            `${logHeader} ERROR: Could not build some feed item from this post (slug:${post.slug})`
          )
        }
        if (newFeedItem) feed.item(newFeedItem)
      }

      // setup root path.
      const path = compileText({ locale })

      // write data into a feed file.
      utils.writeFile(path, filename, feed.xml(), logHeader)
    }
  } catch (error) {
    console.trace(`[${SCRIPT_NAME}] `, error.stack)
  }
}

module.exports = {
  FEED_ROOT_PATH,
  CURRENT_DATETIME,
  buildProcess,
  buildQueryParamFunc,
  appleNewsFeedGenerator,
  rssFeedGenerator,
  msnHomeTagFeedGenerator,
  tribuneDistributionFeedGenerator,
  msnGalleryFeedGenerator,
  msnArticleFeedGenerator,
  smartViewFirstGenerator,
  updayFeedGenerator,
  generatedTDModifiedDate,
  fullContentFeedGenerator,
  operaNewsFeedGenerator,
}
