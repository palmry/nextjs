import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Layout from '../Layout'
import DocumentHead from '../DocumentHead'
import AuthorHeader from './AuthorHeader'
import AuthorPostList from './AuthorPostList'
import { COLORS } from '../../utils/styles'
import AdProviderWrapper, { ScAdSlotLeader } from '../AdProviderWrapper'
import { AdSlot } from 'wildsky-components'
import AdFooter from 'wsc/components/AdFooter'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { useTranslator } from '../../hooks/useTranslator'
import { getDocumentHeadKey } from 'wsc/utils/common'

const ScWrapper = styled.div`
  --author-info-link-border-bottom: 0.125rem solid ${COLORS.LT_SUN_YELLOW};
  --author-info-link-border-bottom-hover: 0.125rem solid ${COLORS.LT_SUN_YELLOW};
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AuthorPage = ({ author }) => {
  const { isMobile } = useContext(DetectDeviceContext)
  const { locale } = useTranslator()

  const slotList = !isMobile ? ['leader'] : ['leader', 'footer']

  return (
    <Layout>
      <DocumentHead title={author.name} key={getDocumentHeadKey(locale, author.slug)} />
      <AdProviderWrapper slotList={slotList} reset={author.slug}>
        <ScAdSlotLeader marginTop="50px">
          <AdSlot au3="leader" />
        </ScAdSlotLeader>
        <ScWrapper>
          {/* Author Header */}
          <AuthorHeader
            author={author}
            withImageShadow={false}
            neverShowImageFrame={true}
            withSharpIcon={false}
          />
          {/* Author Post List */}
          <AuthorPostList authorId={author.sys.id} />
        </ScWrapper>
        <AdFooter />
      </AdProviderWrapper>
    </Layout>
  )
}

AuthorPage.propTypes = {
  author: PropTypes.object.isRequired,
}

export default AuthorPage
