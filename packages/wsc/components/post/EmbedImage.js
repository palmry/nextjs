import React, { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import PropTypes from "prop-types"
import styled from "styled-components"
import HtmlScriptTagsLoader from "../HtmlScriptTagsLoader"

const ScEmbed = styled.div`
  margin-bottom: 1.5rem;

  iframe {
    max-width: 100%;
    margin-bottom: 0 !important;
    border: none;
  }

  .embedly-card {
    margin-bottom: -1.5rem; /* 24px */
  }
  .embedly-card-hug {
    margin-bottom: 0;
  }

  /* prevent broken mobile layout, from embed content that have been set with larger width */
  embed,
  iframe,
  object {
    max-width: 100%;
    min-width: unset !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
`

const EmbedImage = ({ htmlCode }) => {
  const [ref, inView] = useInView({ rootMargin: "0px 0px 800px 0px" })
  const [isRendered, setIsRendered] = useState(false)
  useEffect(() => {
    if (inView) {
      if (window.instgrm && !isRendered) {
        window.instgrm.Embeds.process()
      }
      if (!isRendered) setIsRendered(true)
    }
    // If the instagram script has not successfully loaded yet, we do nothing
    // and let the script calls window.instgrm.Embeds.process() by itself when it is loaded
  }, [htmlCode, inView, isRendered])

  if (!inView && !isRendered) htmlCode = ""

  return (
    <>
      <ScEmbed
        ref={ref}
        dangerouslySetInnerHTML={{
          __html: htmlCode,
        }}
      />
      {inView && <HtmlScriptTagsLoader htmlCode={htmlCode} />}
    </>
  )
}

EmbedImage.propTypes = {
  // string in html format
  htmlCode: PropTypes.string.isRequired,
}

export default EmbedImage
