import isEmpty from 'lodash/isEmpty'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import GetPostListQuery from '../graphql/GetPostListQuery'
import FancyTitle from './FancyTitle'
import GridList from '../GridList'
import PostItemLayout, { generatePostDataProps } from '../PostItemLayout'
import { COLORS } from '../../utils/styles'
import { useTranslator } from '../../hooks/useTranslator'
import { sendGaEvent } from 'wsc/utils/googleTagManager'

const ScTitleBox = styled.div`
  margin-bottom: 20px;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const RecommendedPosts = ({ limit, excludedPostSlugs }) => {
  const { translator } = useTranslator()
  return (
    <GetPostListQuery limit={limit} excludedPostSlugs={excludedPostSlugs}>
      {({ posts, isLoading, isError }) => {
        if (isLoading || isError || isEmpty(posts)) return null

        return (
          <React.Fragment>
            <ScTitleBox>
              <FancyTitle
                title={translator('postPage.recommended')}
                titleClassName="font-section-header-2"
                underlineColor={COLORS.LT_SUN_YELLOW}
              />
            </ScTitleBox>
            {!isEmpty(posts) && (
              <GridList column={1} columnGap="0" rowGap="50px">
                {posts.map(post => (
                  <PostItemLayout
                    key={`post-${post.slug}`}
                    {...generatePostDataProps(post)}
                    // styling
                    displayCategoryTitleColor={COLORS.GREY}
                    isDisplayCategoryTitleBold={false}
                    titleHtmlTag={'h4'}
                    titleLines={{ desktopLines: 3 }}
                    // layout handler
                    displayCategoryMarginTop={'16px'}
                    optionsDynamicSizeImage={{
                      imageSizeValues: [300],
                      imageHeight: '10.125rem',
                      isColumnDirection: true,
                    }}
                    onClick={() =>
                      sendGaEvent({
                        eventName: 'recommendedContentClick',
                        position: 'right rail',
                      })
                    }
                  />
                ))}
              </GridList>
            )}
          </React.Fragment>
        )
      }}
    </GetPostListQuery>
  )
}

RecommendedPosts.propTypes = {
  limit: PropTypes.number,
  relateCategory: PropTypes.string,
  excludedPostSlugs: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
}

RecommendedPosts.defaultProps = {
  limit: 4,
  relateCategory: null,
  excludedPostSlugs: [],
}

export default RecommendedPosts
