import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import styled from 'styled-components'
import Layout from '../Layout'
import DocumentHead from '../DocumentHead'
import FancyHeader from '../FancyHeader'
import PostItemLayout, { generatePostDataProps } from '../PostItemLayout'
import { POST_ITEM_IMAGE_TYPE, MEDIA } from '../../utils/styles'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

import AdProviderWrapper, { ScAdSlotLeader } from '../AdProviderWrapper'
import { AdSlot } from 'wildsky-components'
import AdFooter from 'wsc/components/AdFooter'

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin: 50px 0;`}
  ${MEDIA.TABLET`margin: 40px 0;`}
  ${MEDIA.MOBILE`margin: 30px 0;`}
`

const ScFancyHeader = styled(FancyHeader)`
  margin-bottom: 30px;
`

const ScArticle = styled.article`
  margin-bottom: 40px;
  ${MEDIA.DESKTOP`margin-bottom: 60px;`}
`

const TagPage = props => {
  const { isDesktop, isMobile } = useContext(DetectDeviceContext)
  const { title, posts } = props

  const slotList = !isMobile ? ['leader'] : ['leader', 'footer']

  return (
    <Layout>
      <DocumentHead key={'tag'} title={title} ogType="article" />

      <AdProviderWrapper slotList={slotList} reset={title}>
        <ScAdSlotLeader marginTop={isDesktop ? '50px' : '40px'}>
          <AdSlot au3="leader" />
        </ScAdSlotLeader>

        <ScWrapper>
          <ScFancyHeader
            title={title}
            withCenterLayout={false}
            withUnderline={true}
            titleHtmlTag="h1"
          />
          {isEmpty(posts) && 'There is not any post in this tag.'}
          {posts.map(post => {
            return (
              <ScArticle key={post.slug}>
                <PostItemLayout
                  {...generatePostDataProps(post, true)}
                  // styling
                  titleHtmlTag="h2"
                  titleLines={{ mobileLines: 3, tabletLines: 3, desktopLines: 4 }}
                  // layout
                  imageType={
                    isMobile
                      ? POST_ITEM_IMAGE_TYPE.FULL_WIDTH_IMAGE
                      : POST_ITEM_IMAGE_TYPE.DYNAMIC_SIZE_IMAGE
                  }
                  optionsDynamicSizeImage={
                    isDesktop
                      ? {
                          imageWidth: '530px',
                          imageHeight: '300px',
                          isColumnDirection: false,
                        }
                      : { imageWidth: '100%', imageHeight: '340px', isColumnDirection: true }
                  }
                  optionsFullWidthImage={{ imageHeight: '233px' }}
                />
              </ScArticle>
            )
          })}
        </ScWrapper>

        <AdFooter />
      </AdProviderWrapper>
    </Layout>
  )
}

TagPage.propTypes = {
  title: PropTypes.string.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      posts: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          slug: PropTypes.string,
          publishDate: PropTypes.string,
          updatedDate: PropTypes.string,
          featuredImage: PropTypes.shape({
            url: PropTypes.string,
          }),
          displayCategory: PropTypes.shape({
            title: PropTypes.string,
            slug: PropTypes.string,
          }),
          mainCategory: PropTypes.shape({
            slug: PropTypes.string,
          }),
        })
      ),
    })
  ).isRequired,
}

export default TagPage
