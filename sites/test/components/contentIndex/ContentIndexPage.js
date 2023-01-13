import get from "lodash/get"
import React, { useContext } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"
import Layout from "../Layout"
import DocumentHead from "../DocumentHead"
import ModelHeader from "../ModelHeader"
import { MEDIA } from "../../utils/styles"
import AdProviderWrapper, { ScAdSlotLeader } from "../AdProviderWrapper"
import { AdSlot } from "wildsky-components"
import AdFooter from "wsc/components/AdFooter"
import PostList from "../PostList"
import { getDocumentHeadKey } from "wsc/utils/common"
import { useTranslator } from "../../hooks/useTranslator"

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin: 40px 0 50px;`}
  ${MEDIA.TABLET`margin: 30px 0 40px;`}
  ${MEDIA.MOBILE`margin: 24px 0 30px;`}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const ContentIndexPage = (props) => {
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)
  const { locale } = useTranslator()

  //the credit will be displayed only if bannerImage is not null
  const credit = get(props, "bannerImage.description")

  const slotList = !isMobile ? ["leader"] : ["leader", "footer"]

  // convert query condition from GraphQL format into restful API
  const queryCondition = JSON.parse(props["postQueryCondition"])
  let queryConditionString = ""

  Object.keys(queryCondition).forEach((queryKey) => {
    queryConditionString += "&" + queryKey + "=" + queryCondition[queryKey]
  })

  return (
    <Layout>
      <DocumentHead
        title={props.name}
        key={getDocumentHeadKey(locale, props.slug)}
        ogType="article"
      />
      <AdProviderWrapper slotList={slotList} reset={props.slug}>
        <ScAdSlotLeader marginTop={isDesktop ? "50px" : "40px"}>
          <AdSlot au3="leader" />
        </ScAdSlotLeader>

        <ScWrapper>
          <ModelHeader
            title={props.title}
            description={props.content}
            image={props.bannerImage}
            credit={credit}
            underline={true}
          />
          <PostList queryString={queryConditionString} />
        </ScWrapper>

        <AdFooter />
      </AdProviderWrapper>
    </Layout>
  )
}

ContentIndexPage.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  postQueryCondition: PropTypes.string.isRequired,
  content: PropTypes.string,
  bannerImage: PropTypes.object,
}

ContentIndexPage.defaultProps = {
  content: "",
  bannerImage: {},
}

export default ContentIndexPage
