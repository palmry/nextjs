import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Layout from '../Layout'
import DocumentHead from '../DocumentHead'
import AboutHeader from './AboutHeader'
import AboutContributor from './AboutContributor'
import FollowUs from '../followus/FollowUs'
import { MEDIA } from '../../utils/styles'
import AdProviderWrapper, { ScAdSlotLeader } from '../AdProviderWrapper'
import { AdSlot } from 'wildsky-components'
import AdFooter from 'wsc/components/AdFooter'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { useTranslator } from '../../hooks/useTranslator'
import { getDocumentHeadKey } from 'wsc/utils/common'

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin-top: 50px;`}
  ${MEDIA.TABLET`margin-top: 40px;`}
  ${MEDIA.MOBILE`margin-top: 30px;`}
`

const ScSection = styled.div`
  &:not(:last-child):not(:empty) {
    margin-bottom: 50px;
    ${MEDIA.DESKTOP`margin-bottom: 70px;`}
    ${MEDIA.TABLET`margin-bottom: 60px;`}
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AboutPage = ({ data }) => {
  const { locale } = useTranslator()
  const image = get(data, 'image')
  const contributors = get(data, 'contributorsCollection.items')
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)
  const slotList = !isMobile ? ['leader'] : ['leader', 'footer']

  return (
    <Layout>
      <DocumentHead title="Our Mission" key={getDocumentHeadKey(locale, 'about')} />
      <AdProviderWrapper slotList={slotList} reset="about">
        <ScAdSlotLeader marginTop={isDesktop ? '50px' : '40px'}>
          <AdSlot au3="leader" />
        </ScAdSlotLeader>

        <ScWrapper>
          <ScSection>
            <AboutHeader
              imageUrl={image.url}
              imageCredit={image.title}
              ourMission={data.ourMission}
              ourStory={data.ourStory}
            />
          </ScSection>
          {!isEmpty(contributors) && (
            <ScSection>
              <AboutContributor contributors={contributors} />
            </ScSection>
          )}

          <ScSection>
            <FollowUs />
          </ScSection>
        </ScWrapper>

        <AdFooter />
      </AdProviderWrapper>
    </Layout>
  )
}

AboutPage.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
    }),
    ourMission: PropTypes.string,
    ourStory: PropTypes.string,
  }).isRequired,
}

AboutPage.defaultProps = {}

export default AboutPage
