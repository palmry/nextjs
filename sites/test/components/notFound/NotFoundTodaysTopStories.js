import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { MEDIA, COLORS } from '../../utils/styles'

import GetPostListQuery from '../graphql/GetPostListQuery'
import FancyHeader from '../../components/FancyHeader'
import GridList from '../GridList'
import PostItemLayout, { generatePostDataProps } from '../PostItemLayout'

const ScTopStoriesContainer = styled.div`
  margin-top: 1.25rem;
`
const ScHeaderContainer = styled.div`
  text-align: center;
`
const ScHeader = styled.div`
  display: inline-block;
  div {
    font-size: 1.13rem;
    ${MEDIA.TABLET`font-size: 1.19rem;`}
    ${MEDIA.DESKTOP`font-size: 1.25rem;`}
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const NotFoundTodaysTopStories = ({ limit }) => {
  const { isMobile, isDesktop, isTablet } = useContext(DetectDeviceContext)
  const imageHeight = isDesktop ? '18.88rem' : isTablet ? '10.38rem' : '12.94rem'

  return (
    <GetPostListQuery limit={limit}>
      {({ posts, isLoading, isError }) => {
        if (isLoading || isError || isEmpty(posts)) return null

        return (
          <aside>
            <ScHeaderContainer>
              <ScHeader>
                <FancyHeader
                  title="TODAY’S TOP STORIES"
                  titleClassName="font-section-header-1"
                  withUnderline={true}
                  underlineColor={COLORS.LT_HOSPITAL_GREEN}
                />
              </ScHeader>
            </ScHeaderContainer>
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
                    isDisplayCategoryTitleBold={true}
                    titleHtmlTag="h3"
                    // layout handler
                    optionsDynamicSizeImage={{ imageHeight, isColumnDirection: true }}
                    titleLines={{ mobileLines: 2, tabletLines: 2, desktopLines: 2 }}
                  />
                ))}
              </GridList>
            </ScTopStoriesContainer>
          </aside>
        )
      }}
    </GetPostListQuery>
  )
}

NotFoundTodaysTopStories.propTypes = {
  limit: PropTypes.number,
}

NotFoundTodaysTopStories.defaultProps = {
  limit: 4,
}

export default NotFoundTodaysTopStories
