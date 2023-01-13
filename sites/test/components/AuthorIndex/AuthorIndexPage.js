import React from "react"
import { useState, useEffect } from "react"
import get from "lodash/get"
import isEmpty from "lodash/isEmpty"
import styled from "styled-components"
import Layout from "../Layout"
import DocumentHead from "../DocumentHead"
import axios from "axios"
import {
  CONTENTFUL_REST_URL,
  getPostListString,
  constructContentfulPostData,
} from "wsc/utils/contentful"
import AuthorIndexLayout from "./AuthorIndexLayout"
import {
  editorialDirector,
  featureAuthors,
} from "../../statics/configs/authorIndex.json"
import { getDocumentHeadKey } from "wsc/utils/common"
import { useTranslator } from "../../hooks/useTranslator"
import Error from "../../pages/Error"

// on fetch new author fixAuthors will be ignored in useFetchPostsWithInfiniteScroll.js
const ScWrapper = styled.div`
  margin-top: 40px;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AuthorIndexPage = () => {
  const { locale } = useTranslator()
  const [authors, setAuthors] = useState([])

  const showPerpage = 6
  const limit = showPerpage - (featureAuthors.length % showPerpage)
  const nin = getPostListString(
    editorialDirector
      ? featureAuthors.concat(editorialDirector)
      : featureAuthors
  )
  const PAGE_QUERY =
    `${CONTENTFUL_REST_URL}&content_type=author` +
    `&order=-sys.updatedAt` +
    `&limit=${limit}` +
    `&sys.id[nin]=${nin}&fields.status[ne]=Hidden`

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(PAGE_QUERY)
        const postsResponse = get(response, "data", {})
        if (postsResponse.total > 0) {
          setAuthors(constructContentfulPostData(postsResponse))
        }
      } catch (error) {
        console.error(
          `Error when trying to fetch posts of query: ${PAGE_QUERY}`,
          error
        )
        return <Error />
      }
    }
    if (limit !== showPerpage) fetchPost()
  }, [PAGE_QUERY, limit])

  if (limit !== showPerpage && isEmpty(authors)) return null
  return (
    <Layout>
      <DocumentHead
        key={getDocumentHeadKey(locale, "author-index")}
        title="Meet the Team"
      />
      <ScWrapper>
        <AuthorIndexLayout
          editorialDirector={editorialDirector}
          featureAuthors={featureAuthors.concat(authors)}
        />
      </ScWrapper>
    </Layout>
  )
}

export default AuthorIndexPage
