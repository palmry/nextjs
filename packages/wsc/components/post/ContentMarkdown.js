import React, { useEffect, useMemo } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { defaultLinkStyleToUseInMD } from "../Link"
import { COLORS, MEDIA, withFullscreenOnMobile } from "../../utils/styles"
import { CssPinterestButton } from "../../utils/pinterest"
import { buildHtml } from "../../utils/markdownToHtml"
import HtmlScriptTagsLoader from "../HtmlScriptTagsLoader"

const ScHTMLContent = styled.div`
  ${defaultLinkStyleToUseInMD}

  figcaption.figure-caption {
    margin: 0;
    text-align: right;
    color: var(--contentMarkdown_figureCaption_color);
  }

  img.figure-img {
    display: block;
    width: 100%;
    ${withFullscreenOnMobile}
  }

  figure.figure-container {
    padding-top: 1rem;

    & > div {
      position: relative;
    }

    /*
    For some reason the image-link pattern in markdown breaks the html structure.

    We want this markdown pattern
      [![](www.example.com/img.jpg)](www.google.com)
    to be interpreted as
      <a href="www.google.com">
        <figure>
          <img src="www.example.com/img.jpg" />
        </figure>
      </a>

    By the way, it is instead interpreted as
      <p>
        <a href="www.google.com"></a>
      </p>
      <figure>
        <a href="www.google.com">
          <img src="www.example.com/img.jpg" />
        </a>
      </figure>
      <p></p>

    This is why we need to style 'a' tag inside 'figure' tag
    */
    & a {
      border: none;
      display: block;
      position: relative;
    }
    & a:before {
      content: "";
      background-color: var(
        ----contentMarkdown_figureContainer_linkBackgroundColor
      );
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;
    }
    & a:hover:before {
      opacity: var(--contentMarkdown_figureContainer_linkHoverBefore_opacity);
    }
  }

  h2 {
    margin-bottom: 1.5rem; /* 24px */
    ${MEDIA.TABLET`margin-bottom: 1.875rem; /* 30px */`}
    ${MEDIA.DESKTOP`margin-bottom: 1.875rem; /* 30px */`}
  }

  ul,
  ol,
  p,
  figure.figure-container,
  iframe {
    margin-bottom: 2.5rem; /* 40px */
    ${MEDIA.DESKTOP`margin-bottom: 3.125rem; /* 50px */`}
  }

  /* MOMCOM-422 reduce space for this pattern -- h2 then figure-img then p */
  h2 + p:empty + figure.figure-container {
    /* it always has empty p tag between them */
    ${MEDIA.DESKTOP`
    /* There are space 50px between h2 and figure.figure-container
    because of margin-bottom of p:empty (h2 itself has margin-bottom only 30px)
    but we need to have space only 8px so we use (-50px + 8px) */
    margin-top: -2.625rem; /* -42px */
      `}

    & figcaption.figure-caption {
      ${MEDIA.DESKTOP`
        position: absolute; /* get this element out from normal layout */
        width: 100%;
        margin-top: 4px;`}
    }

    & + p:empty + p:not(:empty) {
      /* it always has empty p tag between them */
      ${MEDIA.DESKTOP`
      /* There are space 50px between figure.figure-container and p:not(:empty)
      but we need to have space only 24px so we use (-50px + 24px) */
      margin-top: -1.625rem; /* -26px */
      `}
    }
  }

  li {
    margin-left: 40px;
    margin-bottom: 24px;
    ${MEDIA.TABLET`margin-left: 50px;`}
    ${MEDIA.DESKTOP`
      margin-left: 50px;
      margin-bottom: 30px;
    `}
  }

  /* nested list css */
  li p,
  li ul,
  li ol {
    margin: 0;
  }

  li ul,
  li ol {
    /* use the same rules as margin-bottom of each paragraph */
    margin-top: 2.5rem; /* 40px */
    ${MEDIA.DESKTOP`margin-top: 3.125rem; /* 50px */`}
  }

  li ul {
    list-style-type: disc;
  }

  li li {
    margin-left: 15px;
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
  /* ---------------- */

  iframe {
    border: none;
  }

  blockquote.quote-container {
    margin: 3.125rem 0; /* 50px 0 */
    ${MEDIA.TABLET`margin: 3.75rem 0; /* 60px 0 */`}
    text-align: center;
    p {
      margin: 0;
    }
    .quote-start {
      line-height: 0;
      img {
        width: 80px;
        ${MEDIA.TABLET`width: 110px;`}
        ${MEDIA.TABLET`width: 110px;`}
      }
      display: var(--contentMarkdown_startQuoteContainer_display);
    }
    .quote-end {
      line-height: 0;
      img {
        width: 34px;
      }
      display: var(--contentMarkdown_endQuoteContainer_display);
    }
    .quote-text {
      padding-top: 1px;
      padding-bottom: 1px;
      ${MEDIA.MOBILE`
        margin-left: 17px;
        margin-right: 17px;
      `}
      ${MEDIA.DESKTOP`
        margin-left: 22.625px;
        margin-right: 22.625px;
      `}
    }
    .quote-author {
      margin-left: 37px;
      margin-right: 37px;
      ${MEDIA.TABLET`
        margin-left: 60px;
        margin-right: 60px;
      `}
      ${MEDIA.DESKTOP`
        margin-left: 70px;
        margin-right: 70px;
      `}
    }
    .quote-author {
      font-style: normal;
    }
    .quote-share {
      color: ${COLORS.BLACK};
      font-style: normal;

      svg.icon-twitter {
        width: 1.16rem;
        vertical-align: text-bottom;
        fill: var(
          --contentMarkdown_iconTwitterFillColor,
          ${COLORS.TWILIGHT_BLUE}
        );
      }

      a.quote-share-text {
        border-bottom: none;
        margin: 0 3px 0 6px;

        &:active {
          border-bottom: var(--contentMarkdown_quoteShareText_borderBottom);
        }

        ${MEDIA.DESKTOP`
          &:hover {
            border-bottom: var(--contentMarkdown_quoteShareText_borderBottom);
          }
        `}
      }
    }
    .quote-start,
    .quote-text,
    .quote-end,
    .quote-author {
      margin-bottom: 1.25rem; /* 20px */
      ${MEDIA.TABLET`margin-bottom: 1.5rem; /* 24px */`}
      ${MEDIA.DESKTOP`margin-bottom: 1.875rem; /* 30px */`}
    }
  }

  ${CssPinterestButton}
`

const ContentMarkdown = ({ content, postTitle, postLanguage, className }) => {
  const contentHtml = useMemo(() => {
    return buildHtml(content, postTitle, postLanguage)
  }, [content, postTitle, postLanguage])

  useEffect(
    () => {
      if (window.instgrm) {
        // instagram script was sucessfully loaded

        // initialize instagram card
        window.instgrm.Embeds.process()
      }
      // If the instagram script has not successfully loaded yet, we do nothing
      // and let the script calls window.instgrm.Embeds.process() by itself when it is loaded
    },
    // We need contentHtml to be in the dep array because :
    // contentHtml was changed (e.g. from inserting pinterest btn)
    //  |-> instagram DOM was modified/shifted
    //    |-> instagram DOM broken
    //      |-> must call window.instgrm.Embeds.process() again to re-initialize it
    [contentHtml]
  )
  return (
    <>
      <ScHTMLContent
        dangerouslySetInnerHTML={{ __html: contentHtml }}
        className={className}
      />
      <HtmlScriptTagsLoader htmlCode={contentHtml} />
    </>
  )
}

ContentMarkdown.propTypes = {
  content: PropTypes.string,
  postTitle: PropTypes.string,
  postLanguage: PropTypes.string,
  className: PropTypes.string,
}

ContentMarkdown.defaultProps = {
  content: "",
  postTitle: "",
  postLanguage: null,
  className: null,
}

export default ContentMarkdown
