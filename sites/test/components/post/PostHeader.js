import React, { useContext } from 'react'
import get from 'lodash/get'
import styled from 'styled-components'
import Link from 'wsc/components/Link'
import PropTypes from 'prop-types'
import routes from '../../configs/routes'
import AuthorImage from '../AuthorImage'
import { ResponsiveImageWithBoxShadow } from '../ResponsiveImage'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { useTranslator } from '../../hooks/useTranslator'
import { PostNavBarVisAware } from 'wsc/components/post/PostNav'

import {
  withResponsiveHidden,
  withFlexCenter,
  COLORS,
  MEDIA,
  withFullscreenOnMobile,
} from '../../utils/styles'

const ScContentBox = styled.div`
  margin-top: 11px;
  ${MEDIA.DESKTOP`
    margin-top: 0;
  `}
`
const ScTitleBox = styled.h1`
  margin: 0;
  ${MEDIA.DESKTOP`
    text-align: center;
  `}
`
const ScSubTitleContainer = styled.div`
  ${MEDIA.DESKTOP`
    margin-top: 30px;
    ${withFlexCenter}
  `}
`
const ScSubTitleBox = styled.div`
  display: flex;
  flex-direction: column;
`
const ScSubTitleItem = styled(ScContentBox).attrs({
  className: 'font-description',
})`
  ${props => props.marginTop && `margin-top: ${props.marginTop}px;`}
`
const ScCategoryText = styled.div.attrs({
  className: 'font-description',
})`
  display: inline-block;
  margin-right: 6px;
  text-transform: uppercase;
  font-weight: bold;

  ${MEDIA.DESKTOP`
    display: block;
    width: 100%
    text-align: center;
    margin: 0 0 30px;
  `}

  /* always on bottom line */
  ${props =>
    withResponsiveHidden({
      hideOnDesktop: props.hideOnDesktop,
      existOnDesktop: props.existOnDesktop,
    })}
`
const ScUpdatedAtText = styled.span`
  font-style: italic;
  color: ${COLORS.GREY};
`
const ScRouterLink = styled(Link)``
const ScFeaturedImageBox = styled.div`
  ${withFullscreenOnMobile}
  position: relative;
  && {
    margin-top: 20px;
    ${MEDIA.DESKTOP`margin-top: 50px;`}

    /* reserve space for image shadow length */
    margin-bottom: 15px;
  }
`
const ScImageTitle = styled.span.attrs({
  className: 'font-description',
})`
  position: absolute;
  bottom: -18px;
  right: 0;
  color: #ffffff;
  text-align: right;
  ${MEDIA.MOBILE`margin-right: 15px;`}
  ${MEDIA.TABLET`bottom: -18px;`}
  ${MEDIA.DESKTOP`bottom: -17px;`}
`
const ScRouterCategoryLink = styled(Link)`
  color: ${COLORS.LT_DARK_PEACH};
  text-decoration: none;
  border: none;
  letter-spacing: 0.04rem;
  &:hover {
    color: ${COLORS.LT_DARK_PEACH};
  }
`
const ScAuthorImageSection = styled.div`
  display: flex;
  margin-right: 15px;

  /* always on bottom line */
  ${props => withResponsiveHidden({ existOnDesktop: props.existOnDesktop })}
`
const ScAuthorImage = styled.div`
  &:hover {
    TWILIGHT_BLUE_60
  }
  &:not(:first-child) {
    margin-left: -20px;
  }

  // reverse z-index order
  // todo : use loop
  &:nth-child(1) {
    z-index: 3;
  }
  &:nth-child(2) {
    z-index: 2;
  }
  &:nth-child(3) {
    z-index: 1;
  }
`
const ScAuthorNameSection = styled.div`
  display: inline;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AuthorImageList = props => {
  const authors = props.authors.slice(0, 3)
  return authors.map((author, index) => {
    const isHiddenAuthor = author.status ? !!author.status.includes('Hidden') : false
    const authorImageProps = {
      isLink: !isHiddenAuthor,
      src: author.image ? author.image.url : null,
      size: '50px',
      resourceSizeValues: [50, 100], // it's an intention to not put 150 for 3x here
      resourceSizeRules: ['1x', '2x'], // because it has some conflict with author info page
      withFrame: false,
      withShadow: false,
    }
    return (
      <ScAuthorImage key={`author-image-${index}`}>
        {isHiddenAuthor ? (
          <AuthorImage {...authorImageProps} />
        ) : (
          <Link withDefaultStyle={false} to={'/author/' + author.slug}>
            <AuthorImage {...authorImageProps} />
          </Link>
        )}
      </ScAuthorImage>
    )
  })
}

const AuthorNameList = props => {
  const authors = props.authors.slice(0, 3)
  const { translator } = useTranslator()
  return (
    <ScSubTitleItem marginTop="0">
      {`${translator('global.by')}  `}
      {authors.map((author, index) => {
        const isHiddenAuthor = author.status ? !!author.status.includes('Hidden') : false
        return (
          <ScAuthorNameSection key={`author-name-${index}`}>
            {isHiddenAuthor ? (
              <>{author.name} </>
            ) : (
              <ScRouterLink to={routes.author.pathResolver(author.slug)}>
                {author.name}
              </ScRouterLink>
            )}
            {index < authors.length - 1 && ' & '}
          </ScAuthorNameSection>
        )
      })}
    </ScSubTitleItem>
  )
}

AuthorNameList.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })
  ).isRequired,
}

const PostHeader = props => {
  const { isDesktop, isTablet } = useContext(DetectDeviceContext)
  const {
    updatedDate,
    publishDate,
    hidePublishDate,
    title,
    authors,
    isInfiniteScrollPost,
    postSlug,
    postId,
    series,
  } = props
  const categorySlug = get(props, 'category.slug', '')
  const categoryTitle = get(props, 'category.title', '')
  const imageUrl = get(props, 'image.url')
  const imageTitle = get(props, 'image.title')
  const imageDesc = get(props, 'image.description')
  const featureImageMaxHeight = isDesktop ? '612px' : isTablet ? '342px' : '232px'
  // format updatedAt string
  const { getPostDateTitle } = useTranslator()
  const updatedAtTitle = getPostDateTitle(publishDate, updatedDate)

  return (
    <React.Fragment>
      {!isInfiniteScrollPost && (
        <ScCategoryText existOnDesktop>
          <ScRouterCategoryLink to={routes.category.pathResolver(categorySlug)}>
            {categoryTitle}
          </ScRouterCategoryLink>
        </ScCategoryText>
      )}
      <ScTitleBox>{title}</ScTitleBox>
      {series?.contentNavigation && (
        <PostNavBarVisAware
          post={{
            multipleSeriesCollection: { items: [series] },
            slug: postSlug,
            sys: { id: postId },
          }}
          inAppBar={false}
        />
      )}
      <ScSubTitleContainer>
        <ScAuthorImageSection existOnDesktop>
          <AuthorImageList authors={authors} />
        </ScAuthorImageSection>
        <ScSubTitleBox>
          <ScSubTitleItem>
            <ScCategoryText hideOnDesktop>
              <ScRouterCategoryLink to={routes.category.pathResolver(categorySlug)}>
                {categoryTitle}
              </ScRouterCategoryLink>
            </ScCategoryText>
            {!hidePublishDate && <ScUpdatedAtText>{updatedAtTitle}</ScUpdatedAtText>}
          </ScSubTitleItem>
          <AuthorNameList authors={authors} />
        </ScSubTitleBox>
      </ScSubTitleContainer>
      <ScFeaturedImageBox>
        <React.Fragment>
          <ResponsiveImageWithBoxShadow
            alt={imageTitle}
            title={imageTitle}
            src={imageUrl}
            fixedHeight={featureImageMaxHeight}
            isStaticShadowLength={false}
          />
          <ScImageTitle>{imageDesc}</ScImageTitle>
        </React.Fragment>
      </ScFeaturedImageBox>
    </React.Fragment>
  )
}

PostHeader.propTypes = {
  category: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,

  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })
  ).isRequired,

  image: PropTypes.shape({
    url: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,

  videoId: PropTypes.string,
  title: PropTypes.string.isRequired,
  publishDate: PropTypes.string.isRequired,
  updatedDate: PropTypes.string,
  isInfiniteScrollPost: PropTypes.bool,
  postId: PropTypes.string.isRequired,
  showVideoAds: PropTypes.bool,
  series: PropTypes.object,
}

PostHeader.defaultProps = {
  videoId: null,
  updatedDate: null,
  isInfiniteScrollPost: false,
  showVideoAds: true,
  series: null,
}

export default PostHeader
