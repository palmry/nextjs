import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import {
  useFetchEntriesFromMultipleModelsWithInfiniteScroll,
  SRC,
} from '../hooks/useFetchEntriesFromMultipleModelsWithInfiniteScroll'

import GridList from './GridList'
import PostItemLayout, { generatePostDataProps } from './PostItemLayout'
import { POST_ITEM_IMAGE_TYPE } from '../utils/styles'
import { getFooterHeight } from 'wsc/utils/common'
import { Redirect } from 'react-router-dom'
import routes from '../configs/routes'

const ScWrapper = styled.div`
  margin-top: 2.5rem;
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

const PostList = ({ fetchSrc, queryString, initialPost, filterFunc }) => {
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)

  // query handler
  const { posts, isLoading, isError } = useFetchEntriesFromMultipleModelsWithInfiniteScroll({
    srcList: fetchSrc,
    query: queryString,
    distanceFromBottomToFetchNextPage: getFooterHeight(),
    filterFunc: filterFunc,
  })

  if (isError) return <Redirect to={routes.error.path} />
  if (isLoading && isEmpty(posts)) return null
  const combinedPosts = !isEmpty(initialPost) ? initialPost.concat(posts) : posts
  // handle row-gap
  const rowGap = isDesktop ? '60px' : '40px'

  return (
    <ScWrapper>
      <GridList column={1} columnGap={isMobile ? '0' : '16px'} rowGap={rowGap}>
        {combinedPosts.map(post => (
          <article key={`post-${post.slug}`}>
            <PostItemLayout
              {...generatePostDataProps(post, false)}
              // styling
              titleHtmlTag={'h2'}
              titleLines={{ mobileLines: 3, tabletLines: 5, desktopLines: 4 }}
              // layout
              imageResponsiveConfigs={POST_ITEM_LAYOUT}
            />
          </article>
        ))}
      </GridList>
    </ScWrapper>
  )
}

PostList.propTypes = {
  fetchSrc: PropTypes.array,
  queryString: PropTypes.string,
  initialPost: PropTypes.array,
  filterFunc: PropTypes.func,
}

PostList.defaultProps = {
  fetchSrc: [SRC.CONTENTFUL_POST],
  queryString: null,
  initialPost: [],
  filterFunc: null,
}

export default PostList
