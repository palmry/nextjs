import get from 'lodash/get'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import APP_CONFIGS from '../configs/app'
// import { JW_FONT_CONFIG } from '../configs/fonts'
import { getPostBaseUrl, markUrlAsSeen } from '../utils/url'
import { fbPixelInit, fbSendEvent } from 'wsc/utils/facebookPixel'
import * as keywee from 'wsc/utils/keyweeLib'
import { addComscore } from 'wsc/utils/comscore'
// import * as lotame from 'wsc/utils/lotameLib'

let isFirstPageView = true

const DocumentHead = (props) => {
  const { relatedCategorySlugs } = props
  // validate props
  const title = props.seoTitle || props.title || APP_CONFIGS.title
  const description = props.seoDescription || APP_CONFIGS.description

  const ogURL = getPostBaseUrl()
  const ogTitle = props.ogTitle || props.title || APP_CONFIGS.title
  const ogDescription =
    props.ogDescription || props.seoDescription || APP_CONFIGS.description
  const imageUrl = get(props, 'ogImage.url') || get(props, 'image.url')
  const ogImageUrl = imageUrl
    ? imageUrl +
      (props.isContentfulImage ? '?w=1800&q=50&fm=jpg&fl=progressive' : '')
    : APP_CONFIGS.envUrl + APP_CONFIGS.logo
  const ogImageDescription =
    get(props, 'ogImage.title') ||
    get(props, 'image.title', APP_CONFIGS.description)
  const ogImageWidth =
    get(props, 'ogImage.width') || get(props, 'image.width', 300)
  const ogImageHeight =
    get(props, 'ogImage.height') || get(props, 'image.height', 300)
  const ogType = props.ogType || 'website'
  const canonicalLink = props.canonicalLink || ogURL
  const [firstLoad, setFirstLoad] = useState(true)
  const htmlLanguage = APP_CONFIGS.language
  const parselyData = props.parselyData
  return (
    <>
      <Helmet
        onChangeClientState={() => {
          if (firstLoad) {
            //send GA data through GTM
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
              // The default value of url on GTM is not matched with current URL on browser.
              // It may be delay. So, we set it from frontend instead.
              pageviewURL: window.location.href,
              event: 'HelmetLoaded',
            })

            // We should mark the first URL as the seen url before it is fired again by FirstDynamicPageView event.
            markUrlAsSeen(window.location.href)

            //send FBpx data through
            // fbPixelInit()
            // fbSendEvent('PageView')
            // Send page view event
            if (isFirstPageView) {
              keywee.initialize()
              // lotame.initialize()
              isFirstPageView = false
            } else {
              keywee.sendPageView()
            }
            // lotame.sendPageview()

            // Implement pageview_candidate Keyword
            // addComscore({
            //   catString: props.mainCategorySlug,
            //   relatedCategorySlugs,
            // })

            setFirstLoad(false)
          }
        }}
      >
        {/* html attributes */}
        <html lang={htmlLanguage} />
        {/* seo tags */}
        <title>{`${title} | ${APP_CONFIGS.name}`}</title>
        {process.env.REACT_APP_NETLIFY_CONTEXT !== 'production' && (
          <meta name="robots" content="noindex,nofollow"></meta>
        )}
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalLink} />
        {/* prefetch font */}
        {/* {JW_FONT_CONFIG.map(style => {
          return <link rel="prefetch" href={style.url} as="font" key={style.url} />
        })} */}
        {/* og tags */}
        <meta property="og:url" content={ogURL} />
        <meta property="og:site_name" content={APP_CONFIGS.name} />
        <meta property="og:type" content={ogType} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content={ogImageDescription} />
        <meta property="og:image:width" content={ogImageWidth} />
        <meta property="og:image:height" content={ogImageHeight} />

        {/* twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@LittleThingsUSA" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={ogImageDescription} />

        {/* Tell prerender the page is ready*/}
        <script> window.prerenderReady = true; </script>

        {/* Parsely tag*/}
        <script type="application/ld+json">
          {JSON.stringify(
            parselyData
              ? parselyData
              : {
                  '@context': 'http://schema.org',
                  '@type': 'WebPage',
                  headline: title,
                  url: ogURL,
                  publisher: {
                    '@type': 'Organization',
                    name: APP_CONFIGS.name,
                    logo: {
                      '@type': 'ImageObject',
                      url: APP_CONFIGS.envUrl + APP_CONFIGS.logo,
                    },
                  },
                }
          )}
        </script>
      </Helmet>
    </>
  )
}

DocumentHead.propTypes = {
  title: PropTypes.string,
  image: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
  }),
  publishDate: PropTypes.string,
  // open graph
  ogTitle: PropTypes.string,
  ogType: PropTypes.string,
  ogDescription: PropTypes.string,
  ogImage: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
  }),
  isContentfulImage: PropTypes.bool,
  // search engine
  seoTitle: PropTypes.string,
  seoDescription: PropTypes.string,
  canonicalLink: PropTypes.string,
  // main category
  mainCategorySlug: PropTypes.string,
  // sub category
  relatedCategorySlugs: PropTypes.arrayOf(PropTypes.string),
  // Parsely Tag
  parselyData: PropTypes.object,
}

DocumentHead.defaultProps = {
  title: null,
  image: null,
  publishDate: null,
  // open graph
  ogTitle: null,
  ogType: null,
  ogDescription: null,
  ogImage: null,
  isContentfulImage: true,
  // search engine
  seoTitle: null,
  seoDescription: null,
  canonicalLink: null,
  // main category
  mainCategorySlug: null,
  // sub category
  relatedCategorySlugs: null,
  // Parsely Tag
  parselyData: null,
}

export default DocumentHead
