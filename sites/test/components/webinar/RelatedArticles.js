import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { MEDIA } from '../../utils/styles'
import GridList from '../GridList'
import PostItemLayout, { generatePostDataProps } from '../PostItemLayout'

const ScTopStoriesContainer = styled.div`
  width: 1088px;
  ${MEDIA.TABLET`
    width: 608px;
  `}
  ${MEDIA.MOBILE`
    width: 100%;
    margin: 0 23px;
  `}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const RelatedArticles = ({ posts }) => {
  const { isMobile, isDesktop, isTablet } = useContext(DetectDeviceContext)
  const imageHeight = isDesktop ? '302px' : isTablet ? '166px' : '207px'

  return (
    <ScTopStoriesContainer>
      <GridList
        column={isMobile ? 1 : 2}
        columnGap={isMobile ? '0' : '16px'}
        rowGap={isDesktop ? '50px' : '40px'}
      >
        {posts.map(post => (
          <PostItemLayout
            key={`post-${post.slug}`}
            {...generatePostDataProps(post)}
            // styling
            titleHtmlTag="h3"
            titleLines={{ mobileLines: 2, tabletLines: 2, desktopLines: 2 }}
            // layout
            optionsDynamicSizeImage={{ imageHeight, isColumnDirection: true }}
          />
        ))}
      </GridList>
    </ScTopStoriesContainer>
  )
}

RelatedArticles.propTypes = {
  posts: PropTypes.array.isRequired,
}

RelatedArticles.defaultProps = {}

export default RelatedArticles
