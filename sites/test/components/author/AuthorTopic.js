import React, { useState, useEffect } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import Link from "wsc/components/Link"
import axios from "axios"
import get from "lodash/get"
import { CONTENTFUL_REST_URL } from "wsc/utils/contentful"
import { MEDIA } from "../../utils/styles"
import { useTranslator } from "../../hooks/useTranslator"

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/
const ScWrapper = styled.div`
  text-align: center;
`
const TopicWrapper = styled(Link)`
  margin-left: 5px;
  margin-right: 5px;

  font-size: 0.69rem;
  ${MEDIA.TABLET` font-size: 0.75rem;`}
  ${MEDIA.MOBILE` font-size: 0.75rem;`}
`
const LinkWrapper = styled.div`
  display: inline-block;
`
const AuthorTopic = ({ author }) => {
  const [topics, setTopics] = useState([])
  const { locale, getSubcategoryConfig } = useTranslator()
  let dateTime = new Date()
  dateTime.setHours(dateTime.getHours(), 0, 0, 0)
  const CURRENT_DATETIME = dateTime.toISOString()
  useEffect(() => {
    axios
      .get(
        `${CONTENTFUL_REST_URL}&select=fields.relatedCategories,fields.displayCategory&content_type=post&fields.authors.sys.id=${author}&limit=100&order=-fields.publishDate&skip=0&fields.publishDate[lte]=${CURRENT_DATETIME}&locale=${locale}`
      )
      .then((response) => {
        const postsResponse = get(response, "data", {})
        const res = []
        postsResponse.items.forEach((item) => {
          if (item.fields.relatedCategories) {
            item.fields.relatedCategories.forEach((sub) => {
              !res.includes(sub.sys.id) && res.push(sub.sys.id)
            })
          } else {
            !res.includes(item.fields.displayCategory.sys.id) &&
              res.push(item.fields.displayCategory.sys.id)
          }
        })
        setTopics(res)
      })
  }, [author, CURRENT_DATETIME, locale])
  const links = topics.map((sys) => (
    <LinkWrapper key={sys}>
      <TopicWrapper to={"/" + getSubcategoryConfig(sys).slug} key={sys}>
        {getSubcategoryConfig(sys).title.toUpperCase()}
      </TopicWrapper>
    </LinkWrapper>
  ))

  return <ScWrapper>{links}</ScWrapper>
}

AuthorTopic.propTypes = {
  author: PropTypes.string.isRequired,
}

export default AuthorTopic
