import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import {
  useFetchEntriesFromMultipleModelsWithInfiniteScroll,
  SRC,
} from '../hooks/useFetchEntriesFromMultipleModelsWithInfiniteScroll'

import GridList from './GridList'
import PostItemLayout, { generatePostDataProps } from './PostItemLayout'
import { POST_ITEM_IMAGE_TYPE, COLORS } from '../utils/styles'
import { getFooterHeight } from 'wsc/utils/common'
import { Redirect } from 'react-router-dom'
import routes from '../configs/routes'

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const POST_ITEM_LAYOUT = {
  MOBILE_S: {
    isSqrFlex: true,
    imageType: POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE,
    optionsSquareImage: { imageSize: '100%', isColumnDirection: true },
  },
  MOBILE: {
    optionsDynamicSizeImage: {
      imageWidth: '178px',
      imageHeight: '178px',
      isColumnDirection: true,
    },
    isSqrFlex: true,
  },
  TABLET: {
    optionsDynamicSizeImage: {
      imageWidth: '276px',
      imageHeight: '166px',
      isColumnDirection: true,
    },
    isSqrFlex: false,
  },
  DESKTOP: {
    optionsDynamicSizeImage: {
      imageWidth: '312px',
      imageHeight: '175px',
      isColumnDirection: true,
    },
    isSqrFlex: false,
  },
}

const SeriesPostList = ({ fetchSrc, queryString }) => {
  const { isMobile_S, isMobile, isDesktop } = useContext(DetectDeviceContext)
  if (isMobile_S) POST_ITEM_LAYOUT.MOBILE = POST_ITEM_LAYOUT.MOBILE_S

  // query handler
  const { posts, isLoading, isError } = useFetchEntriesFromMultipleModelsWithInfiniteScroll({
    srcList: fetchSrc,
    query: queryString,
    distanceFromBottomToFetchNextPage: getFooterHeight(),
  })

  if (isError) return <Redirect to={routes.error.path} />
  if (isLoading && isEmpty(posts)) return null
  const showPosts = posts.slice(0, 2)
  // handle row-gap
  const rowGap = isDesktop ? '60px' : '40px'

  return (
    <GridList column={2} columnGap={isMobile ? '12px' : '16px'} rowGap={rowGap}>
      {showPosts.map(post => (
        <article key={`post-${post.slug}`}>
          <PostItemLayout
            {...generatePostDataProps(post, false, false)}
            // styling
            titleColor={COLORS.BLACK}
            titleHtmlTag={'h3'}
            titleLines={{ mobileLines: 4, tabletLines: 4, desktopLines: 4 }}
            // layout
            imageResponsiveConfigs={POST_ITEM_LAYOUT}
            displayCategoryMarginTop="18px"
          />
        </article>
      ))}
    </GridList>
  )
}

SeriesPostList.propTypes = {
  fetchSrc: PropTypes.array,
  queryString: PropTypes.string,
}

SeriesPostList.defaultProps = {
  fetchSrc: [SRC.CONTENTFUL_POST],
  queryString: null,
}

export default SeriesPostList
