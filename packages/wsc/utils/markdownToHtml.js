import React from 'react'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'
import marked from 'marked'
import template from 'lodash/template'
import { createSrcSet } from './responsiveImg'
import quoteStart from '../statics/images/quote-start.svg'
import quoteEnd from '../statics/images/quote-end.svg'
import { renderToString } from 'react-dom/server'
import TwitterMarkdownIcon from '../statics/images/icon-twitter-markdown.svg'
import NavRightIcon from '../statics/images/icon-nav-right.svg'
import { PinterestButton } from './pinterest'
import {
  getStringentEncodeURIComponent,
  markedLink,
  getWindowOption,
} from './redirect'
import { getConfig } from '../globalConfig'

// for injecting pinterest button on top of each image
export const TEMP_POST_TITLE = 'TEMPPOSTTITLE'

// Override marked's image renderer function
// and use it to config marked()
const renderer = new marked.Renderer()
const figureRegex = /<figure.*<\/figure>/ms

renderer.link = markedLink

/**
 * Interpret this markdown pattern `[text](href "title")`
 */
renderer.image = function (href, title, text) {
  const { src, srcSet } = createSrcSet(href)
  return `<figure class=figure-container><div>
    ${PinterestButton({
      postTitle: TEMP_POST_TITLE,
      itemTitle: text,
      itemImageUrl: src,
      itemContent: title,
      withHTML: true,
    })}
    <img class="figure-img" alt="${text || ''}" title="${
    text || ''
  }" src="${src}" srcSet="${srcSet}" sizes="100vw" />
    <figcaption class="figure-caption font-description">${
      title || ''
    }</figcaption></div>
  </figure>`
}

renderer.paragraph = function (text) {
  // look to see if we have a <figure> tag (image) in this paragraph
  const match = figureRegex.exec(text)
  const endFigure = text.indexOf('</figure>') + 9
  if (match !== null) {
    let buffer = ''
    // if there is text before the image, put in a <p>
    if (match.index !== 0) {
      const pText = text.substring(0, match.index)
      if (pText.trim() !== '') buffer += `<p>${pText}</p>`
    }

    // add figure tag raw
    buffer += text.substring(match.index, endFigure)

    //if there is text after the figure tag, add it in a <p> tag
    const pText = text.substring(endFigure)
    if (pText.trim() !== '') {
      buffer += `<p>${pText}</p>`
    }
    return buffer
  } else {
    // normal paragraphs
    return `<p>${text}</p>`
  }
}

/**
 * Interpret this markdown pattern `> quote`
 */
renderer.blockquote = function (quote) {
  // seperate quote text from author by using '|' symbol
  const result = quote.split('|')

  const text = result[0] && result[0].trim() + '</p>'
  const author = result[1] && '<p>&#8212; ' + result[1].trim()

  // clean p tag and use the result in share url
  const quoteStr = quote.replace(/(<p>|<\/p>)|&quot;/gi, '')
  const share = encodeURI(`https://twitter.com/intent/tweet?text=${quoteStr}`)
  const twitterIcon = renderToString(
    <TwitterMarkdownIcon className='icon-twitter' />
  )
  const ScNavRightIconWrapper = styled.div`
    display: inline;
    svg {
      height: 0.47rem;
      width: 0.47rem;
    }
  `
  const navRightIcon = renderToString(
    <ScNavRightIconWrapper>
      <NavRightIcon />
    </ScNavRightIconWrapper>
  )

  if (text && author) {
    return `<blockquote class="quote-container">
      <div class="quote-start"><img src="${quoteStart}" /></div>
      <div class="quote-text">${text}</div>
      <div class="quote-end"><img src="${quoteEnd}"/></div>
      <div class="quote-author font-description">${author}</div>
      <div class="quote-share font-description">
        ${twitterIcon}<a class="quote-share-text" onclick='window.open("${share}", "_blank", "${getWindowOption()}")'><%= text %></a>${navRightIcon}
      </div>
    </blockquote>`
  }

  if (text && !author) {
    return `<blockquote class="quote-container">
      <div class="quote-start"><img src="${quoteStart}" /></div>
      <div class="quote-text">${text}</div>
      <div class="quote-end"><img src="${quoteEnd}"/></div>
      <div class="quote-share font-description">
        ${twitterIcon}<a class="quote-share-text" onclick='window.open("${share}", "_blank", "${getWindowOption()}")'><%= text %></a>${navRightIcon}
      </div>
    </blockquote>`
  }

  return `<blockquote class="quote-container">${quote}</blockquote>`
}

/**
 * convert markdown to html
 * @param {string} md markdown
 * @returns {string} html
 */
function mdToHtml(md, markdownText) {
  let html = marked(md, { renderer })
  html = template(html)({ text: markdownText })
  return html
}

/**
 * update pinterestPostTitle in the Pinterest's pinned description
 * @param {string} html
 * @param {number} foundIndex
 * @param {string} pinterestPostTitle
 * @returns {string} result in HTML format
 */
function updatePinterestButton(html, foundIndex, pinterestPostTitle) {
  return (
    html.slice(0, foundIndex) +
    getStringentEncodeURIComponent(pinterestPostTitle) +
    html.slice(foundIndex + TEMP_POST_TITLE.length)
  )
}

/**
 * Modify html elements of post content to
 * 1. inject suggested posts
 * 2. complete the pinterest button
 * @param {string} html
 * @param {Object[]} suggestedPosts to-be-injected posts' data
 * @param {string} pinterestPostTitle to-be-replaced in Pinterest's description
 * @returns {string} HTML format
 */
function modifyHtml(html, pinterestPostTitle) {
  let resultHtml = html
  const pinterestButtonRegex = TEMP_POST_TITLE
  const composedRegex = new RegExp(`${pinterestButtonRegex}`, 'g')

  let foundRegex = composedRegex.exec(resultHtml)
  while (foundRegex !== null) {
    const matched = foundRegex[0]

    if (!isEmpty(pinterestPostTitle) && matched === pinterestButtonRegex) {
      resultHtml = updatePinterestButton(
        resultHtml,
        foundRegex.index,
        pinterestPostTitle
      )
    }

    foundRegex = composedRegex.exec(resultHtml)
  }

  return resultHtml
}

/**
 * whole process from raw markdown to final html
 * @param {string} md content in markdown format
 * @param {Object[]} suggestedPosts posts' data that we want to inject into the middle of content
 * @param {string} pinterestPostTitle posts' title that use to replace Pinterest's pin description
 * @returns {string} content in html format
 */
export function buildHtml(md, pinterestPostTitle, postLanguage = 'en') {
  if (isEmpty(md)) return ''
  if (!postLanguage) postLanguage = 'en'
  let html = mdToHtml(
    md,
    getConfig('Translations')[postLanguage].global.markdownText
  )

  // don't need to iterate modifying html
  if (isEmpty(pinterestPostTitle)) return html

  // either inject Suggest Posts, or replace Pinterest's pin description
  html = modifyHtml(html, pinterestPostTitle)
  return html
}
