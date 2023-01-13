import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import routes from '../../configs/routes'
import Link, { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import AuthorImage from '../AuthorImage'
import { MEDIA } from '../../utils/styles'
import PostAuthorContent from './PostAuthorContent'

import isEmpty from 'lodash/isEmpty'
import marked from 'marked'
import { markedLink } from 'wsc/utils/redirect'
import AuthorSocialLinks from '../author/AuthorSocialLinks'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

const ScAuthors = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
const ScAuthor = styled.div.attrs({
  className: 'font-small-body',
})`
  display: flex;
  ${MEDIA.MOBILE`
    flex-grow: 1;
    align-items: center;
    text-align: center;
    flex: 1 50%;
    flex-direction: column;
    margin-top: 20px;`}
  ${MEDIA.TABLET`
    flex-grow: 1;
    flex: 1 100%;
    flex-direction: row;
    margin-top: 7px;`}
  ${MEDIA.DESKTOP`
    flex: 1 33%;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 7px;`}
`
const ScContentWrapper = styled.div`
  align-items: center;
  ${MEDIA.MOBILE`margin-top: 10px;`}
  ${MEDIA.TABLET`margin-left: 40px;
  margin-bottom: 25px;`}
  ${MEDIA.DESKTOP`margin: 20px 38px 0px;`}
`
//may need unset margin
const ScContentItem = styled.div`
  ${defaultLinkStyleToUseInMD}
  ${MEDIA.TABLET`
  &:first-child {
    margin-bottom: 15px;
  }
  `}
  ${MEDIA.DESKTOP`
  &:first-child {
    margin-bottom: 15px;
  }
  `}
`
const renderer = new marked.Renderer()
renderer.link = markedLink

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/
const PostAuthorMultipleAuthors = ({ authors }) => {
  authors = authors.slice(0, 3)
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)
  const empDiv = authors.length % 3 ? Array(3 - (authors.length % 3)).fill(1) : []
  return (
    <ScAuthors>
      {authors.map(author => {
        const { name, slug, content } = author
        const imageUrl = author.image ? author.image.url : null
        return (
          <ScAuthor key={`author-${slug}`}>
            {/* image section */}
            <AuthorImage src={imageUrl} size={isDesktop ? '80px' : '40px'} withFrame={isDesktop} />
            {/* content section */}
            <ScContentWrapper>
              <ScContentItem>
                <Link to={routes.author.pathResolver(slug)}>{name}</Link>
              </ScContentItem>
              {!isEmpty(content) && !isMobile && (
                <ScContentItem>
                  <PostAuthorContent
                    dangerouslySetInnerHTML={{
                      __html: marked(content.replace(/(\r\n|\n|\r)+/gm, '<br>'), { renderer }),
                    }}
                  />
                </ScContentItem>
              )}
              {!isMobile && <AuthorSocialLinks author={author} />}
            </ScContentWrapper>
          </ScAuthor>
        )
      })}
      {empDiv.map(item => (
        //when it has empty space flex will fill it out so i make fake div to take those space
        <ScAuthor key={`author-empty-${item}`}></ScAuthor>
      ))}
    </ScAuthors>
  )
}
PostAuthorMultipleAuthors.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })
  ).isRequired,
}

export default PostAuthorMultipleAuthors
