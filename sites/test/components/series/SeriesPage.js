import get from 'lodash/get'
import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

import Layout from '../Layout'
import DocumentHead from '../DocumentHead'
import PromoPostList from '../PromoPostList'
import ModelHeader from '../ModelHeader'

import { MEDIA } from '../../utils/styles'

import AdProviderWrapper, { ScAdSlotLeader } from '../AdProviderWrapper'
import { AdSlot } from 'wildsky-components'
import AdFooter from 'wsc/components/AdFooter'
import { useTranslator } from '../../hooks/useTranslator'
import { getDocumentHeadKey } from 'wsc/utils/common'
import { setPostDimensions } from 'wsc/utils/googleTagManager'

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin: 40px 0 50px;`}
  ${MEDIA.TABLET`margin: 30px 0 40px;`}
  ${MEDIA.MOBILE`margin: 24px 0 30px;`}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SeriesPage = ({ series }) => {
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)
  const { locale } = useTranslator()
  const queryString = `&fields.multipleSeries.sys.id=${series.sys.id}`
  const sponsor = series.sponsor
  const showDisplayAds = get(sponsor, 'showDisplayAds') === false ? false : true

  const slotConfig = {
    targeting: {
      sponsored: get(series, 'sponsor.name', null),
    },
  }
  const slotList = !isMobile
    ? [['leader', slotConfig]]
    : [
        ['leader', slotConfig],
        ['footer', slotConfig],
      ]

  useEffect(() => {
    return () => {
      setPostDimensions()
    }
  }, [])
  setPostDimensions({ sponsor })

  return (
    <Layout>
      <DocumentHead
        key={getDocumentHeadKey(locale, series.slug)}
        seoTitle={series.seoTitle}
        title={series.title}
        seoDescription={series.seoDescription}
        ogType="article"
      />
      <AdProviderWrapper slotList={slotList} reset={series.slug}>
        {showDisplayAds && (
          <ScAdSlotLeader marginTop={isDesktop ? '50px' : '40px'}>
            <AdSlot au3="leader" />
          </ScAdSlotLeader>
        )}

        <ScWrapper>
          <ModelHeader
            title={series.title}
            description={series.content}
            image={series.bannerImage}
            sponsor={sponsor}
          />
          <PromoPostList queryString={queryString} />
        </ScWrapper>

        {showDisplayAds && <AdFooter />}
      </AdProviderWrapper>
    </Layout>
  )
}

SeriesPage.propTypes = {
  series: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.object,
  }),
}

SeriesPage.defaultProps = {
  series: {},
}

export default SeriesPage
