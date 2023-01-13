import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import GetPostListQuery, { getMainCategoryQueryString } from '../graphql/GetPostListQuery'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import styled from 'styled-components'
import { MEDIA, POST_ITEM_IMAGE_TYPE, COLORS } from '../../utils/styles'
import GridList from '../GridList'
import PostItemLayout, { generatePostDataProps } from '../PostItemLayout'
import isEmpty from 'lodash/isEmpty'
import { sendGaEvent } from 'wsc/utils/googleTagManager'

const ScWrapper = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  ${MEDIA.TABLET`margin-top: 60px; margin-bottom: 60px;`}
`
const ScContainer = styled.div`
  margin-top: 10px;
  ${MEDIA.TABLET`margin-top: 20px;`}
`

const SuggestedPosts = props => {
  const { suggestedPosts, categorySlug, slug } = props
  const { isMobile, isDesktop, isTablet } = useContext(DetectDeviceContext)
  const imageSize = isTablet ? '92px' : '94px'

  let fetchLatestPosts = suggestedPosts.length === 0 ? true : false
  let initialPosts = suggestedPosts || []

  return (
    // Use <GetPostListQuery> to fetch suggested posts which are in the same category as
    // the current article/post
    <GetPostListQuery
      limit={isMobile ? 1 : 2}
      queryString={getMainCategoryQueryString(categorySlug)}
      excludedPostSlugs={slug}
      ignoreFetching={!fetchLatestPosts}
      initialPosts={initialPosts}
    >
      {({ posts, isError, isLoading }) => {
        if (isError || isLoading || isEmpty(posts)) return null

        return (
          <aside>
            <ScWrapper className="SuggestedPosts">
              <ScContainer>
                <GridList
                  column={isMobile ? 1 : 2}
                  columnGap={isDesktop ? '52px' : isTablet ? '16px' : null}
                >
                  {posts.map(post => (
                    <PostItemLayout
                      key={`post-${post.slug}`}
                      {...generatePostDataProps(post, false, false)}
                      // styling
                      titleHtmlTag={'suggestedTitle'}
                      titleLines={{ mobileLines: 3, tabletLines: 3, desktopLines: 3 }}
                      withBoxShadow
                      imageShadowColor={COLORS.LT_DARK_GREEN}
                      // layout handler
                      imageType={POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE}
                      optionsSquareImage={{ imageSize }}
                      columnGap={isDesktop ? '17px' : isTablet ? '22px' : '20px'}
                      onClick={() =>
                        sendGaEvent({
                          eventName: 'recommendedContentClick',
                          position: 'mid article',
                        })
                      }
                    />
                  ))}
                </GridList>
              </ScContainer>
            </ScWrapper>
          </aside>
        )
      }}
    </GetPostListQuery>
  )
}

SuggestedPosts.propTypes = {
  slug: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
  suggestedPosts: PropTypes.arrayOf(PropTypes.object),
}

SuggestedPosts.defaultProps = {
  suggestedPosts: [],
}

export default SuggestedPosts
