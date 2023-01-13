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
import PostItemLayout, {
  generatePostDataProps,
  generatePostDataPropsByPromo,
} from './PostItemLayout'
import { getFooterHeight } from 'wsc/utils/common'
import { POST_ITEM_IMAGE_TYPE, COLORS } from '../utils/styles'
import { Redirect } from 'react-router-dom'
import routes from '../configs/routes'

// TODO : We may merge this component into PostItemLayout if there is any conflict.

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

const PromoPostList = ({ queryString, initialPost }) => {
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)

  // query handler
  const { posts, isLoading, isError } = useFetchEntriesFromMultipleModelsWithInfiniteScroll({
    srcList: [SRC.CONTENTFUL_POST, SRC.CONTENTFUL_PROMO],
    query: queryString,
    distanceFromBottomToFetchNextPage: getFooterHeight(),
  })

  if (isError) return <Redirect to={routes.error.path} />
  if (isLoading && isEmpty(posts)) return null
  const combinedPosts = !isEmpty(initialPost) ? initialPost.concat(posts) : posts

  // handle row-gap
  const rowGap = isDesktop ? '60px' : '40px'

  return (
    <ScWrapper>
      <GridList column={1} columnGap={isMobile ? '0' : '16px'} rowGap={rowGap}>
        {combinedPosts.map(post => {
          const isPromo = post.sys.contentTypeId === 'promo'
          const postDataProps = isPromo
            ? generatePostDataPropsByPromo(post)
            : generatePostDataProps(post)
          return (
            <article key={`post-${post.sys.id}`}>
              <PostItemLayout
                {...postDataProps}
                // styling
                titleHtmlTag={'h2'}
                titleLines={{ mobileLines: 3, tabletLines: 3, desktopLines: 4 }}
                displayCategoryTitleColor={isPromo ? COLORS.GREY : undefined}
                // layout
                imageResponsiveConfigs={POST_ITEM_LAYOUT}
              />
            </article>
          )
        })}
      </GridList>
    </ScWrapper>
  )
}

PromoPostList.propTypes = {
  queryString: PropTypes.string,
  initialPost: PropTypes.array,
}

PromoPostList.defaultProps = {
  queryString: null,
  initialPost: [],
}

export default PromoPostList
