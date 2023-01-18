import isEmpty from 'lodash/isEmpty'
import React, { useState, useContext, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import routes from '../../configs/routes'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

import CircularProgress from '@material-ui/core/CircularProgress'
import FancyHeader from '../FancyHeader'
import GridList from '../GridList'
import PortionLayout from '../PortionLayout'
import PostItemLayout, { generatePostDataProps } from '../PostItemLayout'
import GetPostListQuery, {
  getMainCategoryQueryString,
} from '../graphql/GetPostListQuery'
import { useTranslator } from '../../hooks/useTranslator'

import IconNavLeft from '../../statics/images/icon-nav-left.svg'
import { DefaultButton } from '../button/DefaultButton'

import ICON_TOPICS_UPPER from '../../statics/images/icon-topics-upper.svg'
import ICON_TOPICS_BOTTOM from '../../statics/images/icon-topics-bottom.svg'

import {
  MEDIA,
  COLORS,
  POST_ITEM_IMAGE_TYPE,
  withRightTriangleArrow,
  withButton,
} from '../../utils/styles'

const ScWrapper = styled.div`
  position: relative;
`
const ScContainer = styled.div`
  margin-top: 1.88rem;
`
const ScCategoryButtonHeight = '3.63rem'
const ScCategoryButton = styled(({ isActive, ...restProps }) => (
  <DefaultButton {...restProps} />
)).attrs({ className: 'CategoryButton' })`
  ${withButton}
  position: relative;
  height: ${ScCategoryButtonHeight};
  justify-content: space-between;
  padding: 0 1.25rem;

  svg {
    height: 0.75rem;
    width: 0.75rem;
  }

  ${(props) =>
    props.isActive &&
    css`
      &:after {
        content: '';
        ${withRightTriangleArrow(ScCategoryButtonHeight, COLORS.TWILIGHT_BLUE)}
      }
    `}
`
const ScCategoryTitle = styled.h4`
  color: inherit;
  text-transform: uppercase;
`
const ScLoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const ScCircularProgress = styled(CircularProgress)`
  && {
    color: ${COLORS.TWILIGHT_BLUE};
  }
`

const ScCategoryFlex = styled.div`
  margin: -7px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: space-between;
  ${MEDIA.TABLET`margin: -8px;`}
`

const ScMobileCategoryButton = styled(({ isActive, ...restProps }) => (
  <DefaultButton {...restProps} />
)).attrs({ className: 'CategoryButton' })`
  ${withButton}
  margin: 7px;
  height: 1.88rem;
  padding: 0 1.25rem;
  position: relative;
  justify-content: space-between;
  width: max-content;
  ${MEDIA.TABLET`
    margin: 8px;
    height: 2.06rem;
    padding: 0 1.88rem;
  `}
`
const ScMobileCategoryTitle = styled.h4`
  font-size: 0.79rem;
  color: inherit;
  text-transform: uppercase;
  font-weight: 600;
  ${MEDIA.TABLET`font-size: 0.95rem;`}
`
/*----------------------------------------------------------------------------------
 *  COMPONENTS
 *---------------------------------------------------------------------------------*/

const Loader = () => (
  <ScLoaderWrapper>
    {/* need inline style for this material-ui component */}
    <ScCircularProgress style={{ width: '70px', height: '70px' }} />
  </ScLoaderWrapper>
)

const CategoryItems = ({
  topicSlugs,
  setActiveCategory,
  initialActiveSlug,
}) => {
  const { isDesktop } = useContext(DetectDeviceContext)
  const [currentPointerSlug, setCurrentPointerSlug] =
    useState(initialActiveSlug)
  const onMouseEnterTimeout = useRef(null)
  const { getCategoryConfig } = useTranslator()

  useEffect(() => {
    clearTimeout(onMouseEnterTimeout.current)
    // debounce set active category state to reduce request count
    if (setActiveCategory)
      onMouseEnterTimeout.current = setTimeout(
        () => setActiveCategory(currentPointerSlug),
        1
      )
  }, [currentPointerSlug, setActiveCategory])

  // event handler: on hover category item
  const onMouseEnterCategoryItem = (event) => {
    const slug = event.target.getAttribute('data-slug')
    setCurrentPointerSlug(slug)
  }

  return isDesktop ? (
    <GridList column={1} rowGap={'1.5rem'}>
      {topicSlugs.map((slug) => {
        const config = getCategoryConfig(slug)
        // validate category slug
        if (isEmpty(config)) return null

        return (
          <ScCategoryButton
            key={slug}
            data-slug={slug}
            isActive={currentPointerSlug === slug}
            onMouseEnter={onMouseEnterCategoryItem}
            to={routes.category.pathResolver(slug)}
          >
            <ScCategoryTitle>{config.title}</ScCategoryTitle>
            <IconNavLeft />
          </ScCategoryButton>
        )
      })}
    </GridList>
  ) : (
    <ScCategoryFlex>
      {topicSlugs.map((slug) => {
        const config = getCategoryConfig(slug)
        // validate category slug
        if (isEmpty(config)) return null
        return (
          <ScMobileCategoryButton
            key={slug}
            data-slug={slug}
            onMouseEnter={onMouseEnterCategoryItem}
            to={routes.category.pathResolver(slug)}
          >
            <ScMobileCategoryTitle>{config.title}</ScMobileCategoryTitle>
          </ScMobileCategoryButton>
        )
      })}
    </ScCategoryFlex>
  )
}

CategoryItems.propTypes = {
  topicSlugs: PropTypes.arrayOf(PropTypes.string),
  setActiveCategory: PropTypes.func,
  initialActiveSlug: PropTypes.string,
}

CategoryItems.defaultProps = {
  topicSlugs: [],
  setActiveCategory: () => {},
  initialActiveSlug: null,
}

const PostsLoader = ({ slug }) => {
  return (
    <GetPostListQuery limit={3} queryString={getMainCategoryQueryString(slug)}>
      {({ posts, isLoading, isError }) => {
        if (isLoading) return <Loader />
        if (isError || isEmpty(posts)) return null

        return (
          <GridList column={1} rowGap={'0.94rem'}>
            {posts.map((post, index) => (
              <PostItemLayout
                key={`post-${post.slug}`}
                {...generatePostDataProps(post)}
                // styling
                titleHtmlTag={'h3'}
                titleLines={{ desktopLines: 2 }}
                withBoxShadow
                withSeparator={index !== posts.length - 1}
                // layout handler
                imageType={POST_ITEM_IMAGE_TYPE.SQUARE_IMAGE}
                optionsSquareImage={{ imageSize: '132px' }}
                columnGap={'1.63rem'}
              />
            ))}
          </GridList>
        )
      }}
    </GetPostListQuery>
  )
}

PostsLoader.propTypes = {
  slug: PropTypes.string.isRequired,
}

PostsLoader.defaultProps = {}

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const HomeTopics = ({ topicSlugs }) => {
  const { isDesktop } = useContext(DetectDeviceContext)
  const [activeCategory, setActiveCategory] = useState(topicSlugs[0])

  // validate topic keys
  if (isEmpty(topicSlugs)) return null

  // menu component
  const CategoryItemsComponent = (
    <CategoryItems
      topicSlugs={topicSlugs}
      initialActiveSlug={activeCategory}
      setActiveCategory={isDesktop ? setActiveCategory : null}
    />
  )
  // posts component
  let PostsComponent = isDesktop ? <PostsLoader slug={activeCategory} /> : null

  return (
    <ScWrapper>
      <FancyHeader
        title='topics'
        titleUrl={routes.contentIndex.pathResolver('parenting')}
        iconImage={ICON_TOPICS_UPPER}
        underlineImage={ICON_TOPICS_BOTTOM}
      />
      <ScContainer>
        <PortionLayout
          mainSection={CategoryItemsComponent}
          mainSectionSize={isDesktop ? '324px' : '100%'}
          subSection={PostsComponent}
          columnGap={'3rem'}
        />
      </ScContainer>
    </ScWrapper>
  )
}

HomeTopics.propTypes = {
  topicSlugs: PropTypes.arrayOf(PropTypes.string),
}

HomeTopics.defaultProps = {
  topicSlugs: [],
}

export default HomeTopics
