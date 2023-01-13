// import _ from 'lodash'
import get from "lodash/get"
import isEmpty from "lodash/isEmpty"
import React, { useContext } from "react"
import styled from "styled-components"
// import PropTypes from 'prop-types'

import Layout from "../Layout"
import DocumentHead from "../DocumentHead"
import { MEDIA, COLORS } from "../../utils/styles"
import { AdSlot } from "wildsky-components"
import AdProviderWrapper, {
  ScAdSlotLeader,
  ScAdSlotInContent,
} from "../AdProviderWrapper"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"
import AdFooter from "wsc/components/AdFooter"

import HomeTopFeatured from "./HomeTopFeatured"
import HomeMidFeatured from "./HomeMidFeatured"
import HomeTheLatest from "./HomeTheLatest"
import FollowUs from "../followus/FollowUs"
import MODULE_CONFIGS from "../../statics/configs/module.json"

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin-top: 3.125rem;`}
`

const ScSection = styled.div`
  // check if it's not last section and its children is not empty
  &:not(:last-child):not(:empty) {
    ${MEDIA.MOBILE`padding-bottom: 2.50rem;`}
    ${MEDIA.TABLET`padding-bottom: 3.75rem;`}
    ${MEDIA.DESKTOP`padding-bottom: 4.38rem;`}
  }
`

const HOMEPAGE_TOP_FEATURE = {
  name: "Homepage Top Featured",
  amountOfPosts: 4,
}

const HOMEPAGE_MID_FEATURE = [
  {
    name: "Homepage Mid Featured - Promoted",
    amountOfPosts: 2,
    type: "promoted",
  },
  {
    name: "Homepage Mid Featured - Family",
    amountOfPosts: 2,
    type: "family",
  },
  {
    name: "Homepage Mid Featured - Shop",
    amountOfPosts: 2,
    type: "shop",
  },
]

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const HomePage = (props) => {
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)
  const slotConfig = { targeting: { au2: "homepage" } }
  const slotList = [
    ["leader", slotConfig],
    ["inContent_slot_1", slotConfig],
  ]
  if (isMobile) slotList.push(["footer", slotConfig])

  return (
    <Layout>
      <DocumentHead ogType="article" />
      <AdProviderWrapper slotList={slotList} reset="homepage" postId="homepage">
        <ScAdSlotLeader
          marginTop={isDesktop ? "50px" : "40px"}
          bgColor={COLORS.LT_DARK_PEACH}
        >
          <AdSlot au3="leader" />
        </ScAdSlotLeader>

        <ScWrapper>
          {/* top featured 1+3 posts */}
          <ScSection>
            <HomeTopFeatured moduleConfig={HOMEPAGE_TOP_FEATURE} />
          </ScSection>
          {/* the latest */}
          <ScSection>
            <HomeTheLatest
              injectModuleAfterNumPosts={2}
              moduleConfig={[HOMEPAGE_TOP_FEATURE, ...HOMEPAGE_MID_FEATURE]}
            >
              {HOMEPAGE_MID_FEATURE.map((module) => {
                const featuredPost = get(
                  MODULE_CONFIGS[module.name],
                  "featuredPostsCollection.items",
                  []
                )
                if (isEmpty(featuredPost)) return null

                return (
                  <HomeMidFeatured
                    key={module.name}
                    moduleName={module.name}
                    type={module.type}
                    amountOfPosts={module.amountOfPosts}
                  />
                )
              })}
            </HomeTheLatest>
          </ScSection>
          <ScAdSlotInContent>
            <AdSlot au3="inContent_slot_1" />
          </ScAdSlotInContent>
          {/* social follow us section */}
          <FollowUs />
        </ScWrapper>

        <AdFooter />
      </AdProviderWrapper>
    </Layout>
  )
}

export default HomePage
