import React, { Fragment } from 'react'
import ContentMarkdown from './ContentMarkdown'
// import EmbedImage from './EmbedImage'
import PropTypes from 'prop-types'
// import { JSDOM } from 'jsdom'

let preProcessed = null
// const EMBED_TAG_REGEXP = /<div.+?>*<\/div>|<iframe.+?><\/iframe>|<blockquote.+?(twitter|instagram|tiktok).+?>*<\/blockquote>|<a.+?>Embed*<\/a>|<script.+?><\/script>|<script.+?\/>/gs

// placeholder for markdown in componentList
class MarkdownPlaceholder {
  constructor(markdown, key) {
    this.markdown = markdown
    this.key = key
  }
}

// Fixes formatting of markdown so headings, images, etc have appropriate line spacing
const getParagraphsFromMarkdown = markdown => {
  const lines = markdown.split('\n')
  const paragraphs = []
  let paragraph = ''
  let paragraphType = 't'
  const orderedListRegex = /^[0-9]+\. /

  const addNewParagraph = newParagraph => {
    //close previous paragraph
    if (paragraph !== '') {
      paragraphs.push(paragraph + '\n')
      paragraph = ''
      paragraphType = 't'
    }

    //also add new one if provided
    if (newParagraph) paragraphs.push(newParagraph + '\n\n')
  }

  // process each line
  lines.forEach(line => {
    //blank line denotes a new paragraph
    if (line.trim() === '') {
      addNewParagraph()
    }
    // headings
    else if (line[0] === '#') {
      addNewParagraph(line)
    }
    // images
    else if (line.length > 2 && line[0] === '!' && line[1] === '[') {
      addNewParagraph(line)
    }
    // unordered lists
    else if (line[0] === '*' || line[0] === '-' || line[0] === '+') {
      const listType = line[0]
      //if we aren't building the same list type as this one, close current paragraph
      if (paragraphType !== listType) {
        addNewParagraph()
        paragraphType = listType
      }
      paragraph += line + '\n'
    }
    // ordered lists
    else if (orderedListRegex.test(line)) {
      if (paragraphType !== 'ol') {
        addNewParagraph()
        paragraphType = 'ol'
      }
      paragraph += line + '\n'
    }
    // all others (basic text)
    else {
      // if we were building a non-basic-text paragraph before, close it since we're at text again
      if (paragraphType !== 't') addNewParagraph()
      // append to last line
      paragraph += line + '\n'
    }
  })
  paragraphs.push(paragraph)
  return paragraphs
}

export const createMarkdownPlaceHolder = (markdown, key) => {
  return [new MarkdownPlaceholder(markdown, key)]

  /*
  We will enable this once we fixed twitter quote issue.
  let regExpExecArray
  let markdownPlaceholders = []
  let keyCounter = 0
  try {
    let element = new JSDOM(markdown)
    // cleanup html
    const tempMarkdown = element.window.document.body.innerHTML
    let markdownBuffer = tempMarkdown

    // find embed tags then rebuild them by EmbedImage component
    while ((regExpExecArray = EMBED_TAG_REGEXP.exec(tempMarkdown)) !== null) {
      let matchedEmbedTag = regExpExecArray[0]
      const tagIndex = markdownBuffer.indexOf(matchedEmbedTag)
      const markdownContent = markdownBuffer.substring(0, tagIndex)
      let isScript = false
      // There is a limitation in regex. It cannot determine where the closed element is if there are many child.
      // So, we use jsdom to query element to ensure we pick all child in target element.
      if (matchedEmbedTag.indexOf('<div') === 0) {
        element = new JSDOM(markdownBuffer)
        if (matchedEmbedTag.includes('class="tumblr-post"')) {
          matchedEmbedTag = element.window.document.querySelector(`[class="tumblr-post"]`).outerHTML
        } else if (matchedEmbedTag.includes('itemtype="https://schema.org/VideoObject"')) {
          matchedEmbedTag = element.window.document.querySelector(
            `[itemtype="https://schema.org/VideoObject"]`
          ).outerHTML
        } else {
          continue
        }
      } else if (matchedEmbedTag.indexOf('<script') === 0) {
        let lastComponent = markdownPlaceholders[markdownPlaceholders.length - 1]
        if (lastComponent instanceof MarkdownPlaceholder) {
          lastComponent.markdown += matchedEmbedTag
        } else {
          markdownPlaceholders[markdownPlaceholders.length - 1] = (
            <EmbedImage htmlCode={lastComponent.props.htmlCode + matchedEmbedTag}></EmbedImage>
          )
        }
        isScript = true
      }

      // remove used content from buffer
      markdownBuffer = markdownBuffer.replace(markdownContent + matchedEmbedTag, '')

      if (isScript) continue

      // put normal markdown
      markdownPlaceholders.push(
        new MarkdownPlaceholder(markdownContent, `${key}-markdown-${keyCounter}`)
      )

      // put embed markdown
      markdownPlaceholders.push(
        <EmbedImage
          htmlCode={matchedEmbedTag}
          key={`${key}-embed-image-${keyCounter}`}
        ></EmbedImage>
      )

      keyCounter++
    }

    // put rest content
    if (markdownBuffer !== '') {
      markdownPlaceholders.push(
        new MarkdownPlaceholder(markdownBuffer, `${key}-markdown-${keyCounter}`)
      )
    }
  } catch (e) {
    // Do not convert any embed image if there is an error.
    console.error('Could not process the markdown due to error. ', e)
    markdownPlaceholders = [new MarkdownPlaceholder(markdown, `${key}-markdown-${keyCounter}`)]
  }
  return markdownPlaceholders*/
}

export const processMarkdown = (injectors, markdown, injectorOptions = {}) => {
  if (markdown === null || markdown === '') return

  const paragraphs = getParagraphsFromMarkdown(markdown)

  //build array of components
  let mdBuffer = ''
  let components = []
  let componentCounter = 0
  paragraphs.forEach((paragraph, paragraphIndex, paragraphs) => {
    let beforeList = []
    let afterList = []

    if (paragraph.trim() !== '') {
      // run injectors on the paragraph
      injectors.forEach(injector => {
        const result = injector(paragraphIndex, paragraph, injectorOptions)
        if (result) {
          if (result.before) beforeList = beforeList.concat(result.before)
          if (result.after) afterList = afterList.concat(result.after)
        }
      })

      // inject components before paragraph
      if (beforeList.length > 0) {
        if (mdBuffer !== '') {
          components = components.concat(createMarkdownPlaceHolder(mdBuffer, componentCounter++))
          mdBuffer = ''
        }

        components = components.concat(
          beforeList.map(comp => <Fragment key={componentCounter++}>{comp}</Fragment>) //items require key
        )
      }
      mdBuffer += paragraph

      //inject components after paragraph
      if (afterList.length > 0) {
        if (mdBuffer !== '') {
          components = components.concat(createMarkdownPlaceHolder(mdBuffer, componentCounter++))
          mdBuffer = ''
        }

        components = components.concat(
          afterList.map(comp => <Fragment key={componentCounter++}>{comp}</Fragment>) //items require key
        )
      }
    }
  })

  if (mdBuffer !== '') {
    components = components.concat(createMarkdownPlaceHolder(mdBuffer, componentCounter))
  }

  preProcessed = {
    markdown,
    components,
  }
  return components
}

const MarkdownInjector = props => {
  const { componentInjectors, markdown, injectorOptions } = props
  let injectors = componentInjectors
  if (markdown === null || markdown === '') return null

  if (!injectors) {
    return <ContentMarkdown {...props} content={markdown} />
  }
  // can be array or single function
  if (!Array.isArray(injectors)) injectors = [injectors]

  let components
  if (preProcessed != null && preProcessed.markdown === markdown) {
    components = preProcessed.components
  } else {
    components = processMarkdown(injectors, markdown, injectorOptions)
  }

  components.forEach((component, index) => {
    if (component instanceof MarkdownPlaceholder) {
      components[index] = (
        <ContentMarkdown {...props} content={component.markdown} key={component.key} />
      )
    }
  })

  return <>{components}</>
}
MarkdownInjector.defaultProps = {
  markdown: '',
  injectorOptions: {},
}
MarkdownInjector.propTypes = {
  markdown: PropTypes.string,
  componentInjectors: PropTypes.array.isRequired,
  injectorOptions: PropTypes.shape({}),
}

export default MarkdownInjector
