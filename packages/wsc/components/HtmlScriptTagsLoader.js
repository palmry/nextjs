import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import HtmlReactParser from 'html-react-parser'

const HtmlScriptTagsLoader = ({ htmlCode }) => {
  // extract script tags from html code
  const SCRIPT_TAG_REGEXP = /<script.+?><\/script>|<script.+?\/>/gs
  let regExpExecArray
  let scriptTags = []
  while ((regExpExecArray = SCRIPT_TAG_REGEXP.exec(htmlCode)) !== null) {
    let detectedScriptTag = regExpExecArray[0]
    scriptTags.push(detectedScriptTag)
  }

  // load script tags by Helmet
  return <Helmet>{HtmlReactParser(scriptTags.join(''))}</Helmet>
}

HtmlScriptTagsLoader.propTypes = {
  htmlCode: PropTypes.string.isRequired,
}

export default HtmlScriptTagsLoader
