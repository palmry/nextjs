import React from 'react'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useFetchEntriesFromMultipleModelsWithInfiniteScroll } from '../../hooks/useFetchEntriesFromMultipleModelsWithInfiniteScroll'
import { getFooterHeight } from 'wsc/utils/common'
import { Redirect } from 'react-router-dom'
import routes from '../../configs/routes'

import PostItemLayout, { generatePostDataProps } from '../PostItemLayout'
import { POST_ITEM_IMAGE_TYPE, MEDIA } from '../../utils/styles'

const ScWrapper = styled.div``

const ScArticle = styled.article`
  margin-bottom: 50px;
  ${MEDIA.MOBILE`margin-bottom: 40px;`}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const POST_ITEM_LAYOUT = {
  MOBILE: {
    imageType: POST_ITEM_IMAGE_TYPE.FULL_WIDTH_IMAGE,
    optionsFullWidthImage: { imageHeight: '233px' },
  },
  TABLET: {
    imageType: POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE,
  },
  DESKTOP: {
    optionsDynamicSizeImage: { imageWidth: '537px', imageHeight: '302px' },
  },
}

const AuthorPostList = ({ authorId }) => {
  // get author's posts from REST
  const query = `&fields.authors.sys.id=${authorId}`

  const { posts, isLoading, isError } = useFetchEntriesFromMultipleModelsWithInfiniteScroll({
    query: query,
    distanceFromBottomToFetchNextPage: getFooterHeight(),
  })

  if (isError) return <Redirect to={routes.error.path} />
  if (isLoading && isEmpty(posts)) return null

  return (
    <ScWrapper>
      {posts.map(post => (
        <ScArticle key={post.slug}>
          <PostItemLayout
            {...generatePostDataProps(post, true)}
            // layout
            titleHtmlTag="h2"
            titleLines={{ mobileLines: 3, tabletLines: 4, desktopLines: 4 }}
            imageResponsiveConfigs={POST_ITEM_LAYOUT}
          />
        </ScArticle>
      ))}
    </ScWrapper>
  )
}

AuthorPostList.propTypes = {
  authorId: PropTypes.string.isRequired,
}

export default AuthorPostList
