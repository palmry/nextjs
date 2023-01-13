import React from 'react'
import get from 'lodash/get'
import { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import ICON_AUTHOR_PLACEHOLDER from '../../statics/images/icon-author-placeholder.png'
import marked from 'marked'
import { markedLink } from 'wsc/utils/redirect'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { COLORS, FONT_FAMILIES, MEDIA } from '../../utils/styles'
import ResponsiveImage from '../ResponsiveImage'

const ScItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 40px;
  }
`
const ScBoxShadow = styled.div`
  box-shadow: 0 12px 16px 0 rgba(33, 47, 74, 0.3);
  border-radius: 50%;
`
const ScName = styled.p`
  color: ${COLORS.LT_DARK_GREY_BLUE};
  font-family: ${FONT_FAMILIES.ASAP};
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 10px;
  ${MEDIA.MOBILE`
    font-size: 1.25rem
    line-height: 1.6;
  `}
  ${MEDIA.TABLET`
    font-size: 1.5rem;
    line-height: 1.55;
  `}
  ${MEDIA.DESKTOP` 
    font-size: 1.69rem;
    line-height: 1.59;
  `}
`
const ScDescription = styled.div`
  ${defaultLinkStyleToUseInMD}
  text-align: center;
  color: ${COLORS.LT_DARK_GREY_BLUE};
  width: 536px;

  ${MEDIA.MOBILE`
    width: 100%;
  `}

  &:not(:last-child) {
    margin-bottom: 30px;
  }
`

const renderer = new marked.Renderer()
renderer.link = markedLink

const Speaker = ({ speakers }) => {
  return (
    <div>
      {speakers.map(speaker => {
        const { name, role, description, image } = speaker
        const imageUrl = get(image, 'url', null)
        return (
          <ScItem key={`speaker-${name}`}>
            <ScBoxShadow>
              <ResponsiveImage
                activeLoad={true}
                src={imageUrl || ICON_AUTHOR_PLACEHOLDER}
                squareSize={'200px'}
                isCircle={true}
              />
            </ScBoxShadow>
            <ScName>{`${name} / ${role}`}</ScName>
            <ScDescription>
              <div dangerouslySetInnerHTML={{ __html: marked(description, { renderer }) }} />
            </ScDescription>
          </ScItem>
        )
      })}
    </div>
  )
}

Speaker.propTypes = {
  speakers: PropTypes.array.isRequired,
}

export default Speaker
