import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import GetPostListQuery, { getMainCategoryQueryString } from '../graphql/GetPostListQuery'
import { useTranslator } from '../../hooks/useTranslator'
import FancyTitle from './FancyTitle'
import GridList from '../GridList'
import PostItemLayout, { generatePostDataProps } from '../PostItemLayout'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { MEDIA, COLORS } from '../../utils/styles'

const ScTitleBox = styled.div`
  margin-bottom: 20px;
  ${MEDIA.MOBILE`text-align: center;`}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const PostTrending = ({ limit, relateCategory, excludedPostSlugs }) => {
  const { isMobile, isDesktop, isTablet } = useContext(DetectDeviceContext)
  const imageHeight = isDesktop ? '18.88rem' : isTablet ? '10.38rem' : '12.94rem'
  const { translator } = useTranslator()

  return (
    <GetPostListQuery
      limit={limit}
      queryString={getMainCategoryQueryString(relateCategory)}
      excludedPostSlugs={excludedPostSlugs}
    >
      {({ posts, isLoading, isError }) => {
        if (isLoading || isError || isEmpty(posts)) return null

        return (
          <aside>
            <ScTitleBox>
              <FancyTitle
                title={translator('postPage.mostPopular')}
                underlineColor={COLORS.LT_HOSPITAL_GREEN}
              />
            </ScTitleBox>
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
                  titleHtmlTag={isTablet ? 'h4' : 'h3'}
                  titleLines={{ mobileLines: 3, tabletLines: 3, desktopLines: 2 }}
                  // layout handler
                  displayCategoryMarginTop={isDesktop ? '18px' : '16px'}
                  optionsDynamicSizeImage={{ imageHeight, isColumnDirection: true }}
                />
              ))}
            </GridList>
          </aside>
        )
      }}
    </GetPostListQuery>
  )
}

PostTrending.propTypes = {
  limit: PropTypes.number,
  relateCategory: PropTypes.string,
  excludedPostSlugs: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
}

PostTrending.defaultProps = {
  limit: 4,
  relateCategory: null,
  excludedPostSlugs: [],
}

export default PostTrending
