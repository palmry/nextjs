import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import PropTypes from 'prop-types'
import PortionLayout from '../PortionLayout'
import HomeTopFeaturedMainSection from './HomeTopFeaturedMainSection'
import HomeTopFeaturedSubSection from './HomeTopFeaturedSubSection'
import { contentfulApiCurrentDateTime } from 'wsc/utils/common'
import MODULE_CONFIGS from '../../statics/configs/module.json'

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const HomeTopFeatured = ({ moduleConfig }) => {
  const { isDesktop, isTablet } = useContext(DetectDeviceContext)
  const topFeaturedModule = MODULE_CONFIGS[moduleConfig.name]

  if (isEmpty(topFeaturedModule)) return null

  const title = get(topFeaturedModule, 'title') || 'Featured'
  const destinationUrl = get(topFeaturedModule, 'destinationUrl')
  const featuredPosts = get(topFeaturedModule, 'featuredPostsCollection.items')

  // filter out post that its publish date is set to future date
  const currentFeaturedPosts = featuredPosts.filter(post => {
    const postPublishDate = Date.parse(post.publishDate)
    return postPublishDate <= Date.parse(contentfulApiCurrentDateTime())
  })

  // if there are no posts to display then hide the whole module
  if (isEmpty(currentFeaturedPosts)) return null

  const postForMainSection = currentFeaturedPosts[0] // 1 post in the left
  const postsForSubSection = currentFeaturedPosts.slice(1, moduleConfig.amountOfPosts) // 3 posts in the right

  return (
    <PortionLayout
      mainSection={<HomeTopFeaturedMainSection post={postForMainSection} />}
      subSection={
        <HomeTopFeaturedSubSection
          posts={postsForSubSection}
          title={title}
          destinationUrl={destinationUrl}
        />
      }
      columnGap="64px"
      rowGap={isDesktop ? '0' : isTablet ? '60px' : '40px'}
      mainSectionSize={isDesktop ? '680px' : '100%'}
      isColumnDirection={!isDesktop}
    />
  )
}

HomeTopFeatured.propTypes = {
  moduleConfig: PropTypes.object.isRequired,
}
HomeTopFeatured.defaultProps = {}

export default HomeTopFeatured
