import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import routes from '../../configs/routes'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

import GridList from '../GridList'
import Layout from '../Layout'
import Link from 'wsc/components/Link'
import DocumentHead from '../DocumentHead'
import FancyHeader from '../FancyHeader'
import PostItemLayout, { generatePostDataProps } from '../PostItemLayout'

import LINE_PINK from '../../statics/images/line-pink.svg'
import { ReactComponent as IconNavLeft } from '../../statics/images/icon-nav-left.svg'

import { MEDIA, POST_ITEM_IMAGE_TYPE, COLORS } from '../../utils/styles'
import { numberFormat } from 'wsc/utils/number'

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin: 50px 0;`}
  ${MEDIA.TABLET`margin: 40px 0;`}
  ${MEDIA.MOBILE`margin: 30px 0;`}
`

const ScGridList = styled(GridList)`
  margin-top: 2.5rem;
  ${MEDIA.MOBILE`margin-top: 1.88rem;`}
`
const ScEmptyStateBox = styled.div`
  margin-top: 1.25rem;
`
const ScHomeButton = styled.div.attrs({ className: 'font-description' })`
  display: inline-block;
  margin-top: 1.88rem;
  text-transform: uppercase;
  color: ${COLORS.DARK_GRAY};
`
const ScIconNavLeft = styled(IconNavLeft)`
  margin-left: 0.21rem;
  height: 0.47rem;
  fill: ${COLORS.DARK_GRAY};
  ${MEDIA.TABLET`margin-left: 0.71rem;`}
  ${MEDIA.DESKTOP`margin-left: 0.64rem;`}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const POST_ITEM_LAYOUT = {
  MOBILE: {
    imageType: POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE,
    optionsSqureImage: { imageSize: '120px' },
  },
  TABLET: {
    imageType: POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE,
    optionsSqureImage: { imageSize: '296px' },
  },
  DESKTOP: {
    optionsDynamicSizeImage: { imageWidth: '530px', imageHeight: '298px' },
  },
}

const EmptyStateBox = () => (
  <ScEmptyStateBox>
    <div>
      Sorry, we were unable to find a match. Please try another keyword or explore our homepage.
    </div>
    <Link to={routes.homepage.path} withDefaultStyle={false}>
      <ScHomeButton>
        Go Home <ScIconNavLeft />
      </ScHomeButton>
    </Link>
  </ScEmptyStateBox>
)

const SearchPage = ({ posts, keyword, total }) => {
  const { isTablet, isDesktop } = useContext(DetectDeviceContext)

  // handle grid-gap
  const rowGap = isDesktop ? '60px' : isTablet ? '40px' : '31px'
  const columnGap = isDesktop ? '28px' : isTablet ? '16px' : '23px'

  return (
    <Layout>
      <DocumentHead />
      <ScWrapper>
        <FancyHeader
          title={`${numberFormat(total)} results for "${keyword}"`}
          withCenterLayout={false}
          underlineImage={LINE_PINK}
          isUnderlineImageCenterAlign={false}
          titleHtmlTag="h1"
          withTextTransform={'unset'}
        />
        {!isEmpty(posts) ? (
          <ScGridList column={1} columnGap={columnGap} rowGap={rowGap}>
            {posts.map(post => (
              <article key={`post-${post.slug}`}>
                <PostItemLayout
                  {...generatePostDataProps(post)}
                  // styling
                  titleHtmlTag={isDesktop ? 'h2' : 'h3'}
                  titleLines={{ mobileLines: 3, tabletLines: 4, desktopLines: 4 }}
                  // layout
                  imageResponsiveConfigs={POST_ITEM_LAYOUT}
                />
              </article>
            ))}
          </ScGridList>
        ) : (
          <EmptyStateBox />
        )}
      </ScWrapper>
    </Layout>
  )
}

SearchPage.propTypes = {
  keyword: PropTypes.string.isRequired,
  total: PropTypes.number,
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
  ),
}

SearchPage.defaultProps = {
  total: 0,
  posts: [],
}

export default SearchPage
