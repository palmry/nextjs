import React, { useContext, useState } from "react"
import isEmpty from "lodash/isEmpty"
import styled from "styled-components"
import PropTypes from "prop-types"
import AuthorIndexImage from "./AuthorIndexImage"
import { MEDIA, COLORS, FONT_FAMILIES } from "../../utils/styles"
import FancyHeader from "../FancyHeader"
import Link from "wsc/components/Link"
import AuthorIndexContent from "./AuthorIndexContent"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"
import {
  useFetchEntriesFromMultipleModelsWithInfiniteScroll,
  SRC,
} from "../../hooks/useFetchEntriesFromMultipleModelsWithInfiniteScroll"
import { getFooterHeight } from "wsc/utils/common"
import Error from "../../pages/Error"
import { getPostListString } from "wsc/utils/contentful"

const ScTitle = styled(FancyHeader)`
  text-align: center;
  margin-bottom: 40px;
  ${MEDIA.TABLET`margin-bottom: 50px;`}
  ${MEDIA.DESKTOP`margin-bottom: 60px;`}
`
const ScAuthors = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
const ScAuthor = styled.div.attrs({
  className: "font-small-body",
})`
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
  margin-bottom: 40px;
  ${MEDIA.MOBILE`
    flex: 1 100%;`}
  ${MEDIA.TABLET`
    flex: 1 50%;
    margin-bottom: 50px;`}
  ${MEDIA.DESKTOP`
    flex: 1 33%;
    margin-bottom: 60px;`}
`
const ScContentWrapper = styled.div`
  display: block;
  align-items: center;
`
const ScAuthorName = styled(({ isHovering, ...props }) => <Link {...props} />)``

const ScTitleTextH3 = styled.h3`
  font-family: ${FONT_FAMILIES.ASAP};
  font-weight: bold;
  line-height: 23px;
  ${MEDIA.TABLET`
    line-height: 27px;`}
  ${MEDIA.DESKTOP`
    line-height: 31px;`}
`

const AuthorComponent = ({ author }) => {
  const { isDesktop } = useContext(DetectDeviceContext)
  const { name, slug, authorTitle } = author
  const imageUrl = author.image ? author.image.url : null
  const [isHovering, setIsHovering] = useState(false)
  const handleMouseOver = () => {
    if (isDesktop) setIsHovering(true)
  }
  const handleMouseOut = () => {
    setIsHovering(false)
  }
  const hoverStateProps = {
    isHovering: isHovering,
    onMouseOver: handleMouseOver,
    onMouseOut: handleMouseOut,
  }

  return (
    <ScAuthor>
      <AuthorIndexImage
        src={imageUrl}
        slug={slug}
        {...hoverStateProps}
        withShadow={true}
      />
      <ScContentWrapper>
        <ScAuthorName to={`/author/${slug}`} {...hoverStateProps}>
          <ScTitleTextH3>{name}</ScTitleTextH3>
        </ScAuthorName>
        <AuthorIndexContent
          authorTitle={!isEmpty(authorTitle) ? authorTitle : ""}
          to={`/author/${slug}`}
          {...hoverStateProps}
        />
      </ScContentWrapper>
    </ScAuthor>
  )
}
AuthorComponent.propTypes = {
  author: PropTypes.object.isRequired,
}

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/
const AuthorIndexLayout = ({ editorialDirector, featureAuthors }) => {
  const nin = getPostListString(
    editorialDirector
      ? featureAuthors.concat(editorialDirector)
      : featureAuthors
  )

  const {
    posts: authors,
    isLoading,
    isError,
  } = useFetchEntriesFromMultipleModelsWithInfiniteScroll({
    srcList: [SRC.CONTENTFUL_AUTHOR],
    distanceFromBottomToFetchNextPage: getFooterHeight(),
    limit: 24,
    query: `&sys.id[nin]=${nin}&fields.status[ne]=Hidden`,
  })
  if (isError) return <Error />
  if (isLoading && isEmpty(authors)) return null

  const authorsToDisplay = featureAuthors.concat(authors)

  return (
    <div>
      <ScTitle
        title="MEET THE TEAM"
        withTextTransform={null}
        withCenterLayout={false}
        withUnderline={true}
        underlineColor={COLORS.LT_HOSPITAL_GREEN}
      />
      {!isEmpty(editorialDirector) && (
        <AuthorComponent
          key={`author-${editorialDirector.slug}`}
          author={editorialDirector}
        />
      )}
      <ScAuthors>
        {authorsToDisplay.map((author) => {
          return (
            <AuthorComponent key={`author-${author.slug}`} author={author} />
          )
        })}
      </ScAuthors>
    </div>
  )
}
AuthorIndexLayout.propTypes = {
  editorialDirector: PropTypes.object,
  featureAuthors: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })
  ).isRequired,
}
AuthorIndexLayout.defaultProps = {
  editorialDirector: null,
}
export default AuthorIndexLayout
