/*
 * Redirect crawlers or serve them the appropriate HTTP status codes.
 * These meta tags are either based on the route configuration, if the
 * URL has a trailing slash or the specific status code you want to render
 */

import React from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import find from 'lodash/find'
import get from 'lodash/get'

import routes from '../../configs/routes'
import { getPostBaseUrl } from '../../utils/url'
import { queryStringsBoolean } from 'wsc/utils/queryStrings'

const PrerenderMetaTags = withRouter(props => {
  const currentPath = get(props, 'match.path')
  const currentRoute = find(routes, function(route) {
    return route.path === currentPath
  })
  const { prerenderStatusCode } = props

  let prerenderTags = []

  /*
   * Skip prerendering under the following conditions...
   *  1. The route should not be prerendered
   *  2. The environment is NOT production
   *  The above conditons can be overridden to force prerendering by adding a query param `?prerender=true`
   */
  function skipPrerender() {
    return (
      (!currentRoute.prerender || process.env.REACT_APP_NETLIFY_CONTEXT !== 'production') &&
      !queryStringsBoolean('prerender')
    )
  }

  /*
   * Redirect prerender not when the URL doesn't match the base URL
   * This means that there is something extra in the URL.
   * For example, a query param like `?123` or something like `/amp`
   */
  function redirectPrerender() {
    return document.location.href !== getPostBaseUrl()
  }

  if (prerenderStatusCode) {
    prerenderTags.push(<meta name="prerender-status-code" content={prerenderStatusCode} />)
  } else if (skipPrerender()) {
    prerenderTags.push(<meta name="prerender-status-code" content="404" />)
  } else if (redirectPrerender()) {
    prerenderTags.push(<meta name="prerender-status-code" content="301" />)
    prerenderTags.push(<meta name="prerender-header" content={`Location: ${getPostBaseUrl()}`} />)
  }

  return <Helmet>{prerenderTags}</Helmet>
})

export default PrerenderMetaTags
