import React, { useContext, useRef } from 'react'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import Layout from '../Layout'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import DocumentHead from '../DocumentHead'
import RSVPForm from './RSVPForm'
import Speaker from './Speaker'
import Schedule from './Schedule'
import { COLORS, MEDIA, withFullWidth } from '../../utils/styles'
import styled from 'styled-components'
import dateformat from 'dateformat'
import { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import marked from 'marked'
import { markedLink } from 'wsc/utils/redirect'
import RelatedArticles from './RelatedArticles'
import { facebookSend } from 'wsc/utils/socialShare'
import AdProviderWrapper from '../AdProviderWrapper'
import AdFooter from 'wsc/components/AdFooter'
import { useTranslator } from '../../hooks/useTranslator'
import { getDocumentHeadKey } from 'wsc/utils/common'

import messengerButton from '../../statics/images/icon-messenger.svg'
import hostIcon from '../../statics/images/webinar/icon-host.svg'
import lineIcon from '../../statics/images/webinar/icon-line.svg'
import giveawaysIcon from '../../statics/images/webinar/icon-giveaways.svg'
import relatedArticlesIcon from '../../statics/images/webinar/icon-related-articles.svg'
import snowflake from '../../statics/images/webinar/icon-snowflake.svg'
import branch from '../../statics/images/webinar/icon-branch.svg'

const ScFlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  ${MEDIA.DESKTOP`
    margin-left: auto;
    margin-right: auto;
  `}
`
const ScBackgroundBox = styled.div`
  && {
    position: absolute;
  }

  background-color: ${COLORS.LT_WEBINAR_LIGHT_GREEN};
  top: 0;
  z-index: -2;
  height: 100%;
  width: 100%;
  ${withFullWidth}
`
const ScLogo = styled.img`
  display: block;
  height: 150px;
  margin: 0 auto 30px;
`
const ScName = styled.h1`
  color: ${COLORS.LT_DARK_GREY_BLUE};
  text-align: center;
  margin-bottom: 20px;
`
const ScHeader = styled.div`
  position: relative;
`
const ScSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
  ${MEDIA.DESKTOP`
    margin-bottom: 70px;
  `}
`
const ScDate = styled.p`
  color: ${COLORS.LT_DARK_GREY_BLUE};
  font-weight: bold;
`
const ScTime = styled(ScDate)`
  font-size: 1rem;
`

const ScDescription = styled.div`
  ${defaultLinkStyleToUseInMD}
  text-align: center;
  color: ${COLORS.LT_DARK_GREY_BLUE};
  ${MEDIA.DESKTOP`
    width: 904px;
  `}
`
const ScRegisterButton = styled.div`
  border-radius: 50px;
  min-width: 174px;
  height: 45px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.94rem;
  text-transform: uppercase;
  font-weight: 500;
  user-select: none;
  color: ${COLORS.WHITE};
  background-color: ${COLORS.LT_DARK_GREY_BLUE};
  ${MEDIA.DESKTOP` 
    &:hover {
      background-color: ${COLORS.LT_SUN_YELLOW};
      cursor: pointer;
    }
  `}

  &:active {
    background-color: ${COLORS.LT_DARK_SUN_YELLOW};
  }
`
const ScText = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: 0.94rem;
  ${MEDIA.MOBILE`
    font-size: 0.75rem;
  `}
`
const ScH2Header = styled.h2`
  color: ${COLORS.LT_DARK_GREY_BLUE};
  text-transform: uppercase;
  margin-bottom: 20px;
`
const ScMarkdown = styled.div`
  img {
    max-width: 100%;

    ${MEDIA.DESKTOP`
      max-width: 90%;
    `}
  }
`
const ScHostIcon = styled(hostIcon)`
  height: 55px;
  ${MEDIA.DESKTOP`
    height: 105px;
  `}
  margin-bottom: 10px;
`
const ScHostLineIcon = styled(lineIcon)`
  height: 16px;
  ${MEDIA.DESKTOP`
    height: 32px;
  `}
  margin-bottom: 10px;
`
const ScGiveawaysLineIcon = styled(lineIcon)`
  height: 16px;
  margin-top: 30px;
`
const ScGiveawaysIcon = styled(giveawaysIcon)`
  height: 65px;
  margin: 24px 8px 15px 0;
  ${MEDIA.DESKTOP`
    height: 115px;
    margin-top: 60px;
    margin-bottom: 40px;
  `}
  transform: rotate(28deg);
`
const ScRelatedArticlesIcon = styled(relatedArticlesIcon)`
  height: 48px;
  ${MEDIA.DESKTOP`
    height: 82px;
  `}
  margin-bottom: 10px;
`
const ScBgWrapper = styled.div`
  width: 100vw;
  position: absolute;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  z-index: -1;
  overflow-x: clip;
}`
const ScSnowflakeHeaderBg = styled(snowflake)`
  height: 102px;
  top: 70px;
  right: -54px;
  ${MEDIA.DESKTOP`
    height: 240px;
    top: -80px;
  `}
  position: absolute;
`
const ScSnowflakeRsvpBg = styled(snowflake)`
  height: 100px;
  top: -68px;
  left: -33px;
  transform: rotate(-19deg);
  ${MEDIA.DESKTOP`
    height: 240px;
    top: -149px;
    left: -110px;
    transform: unset;
  `}
  position: absolute;
`
const ScSnowflakeGiveawaysBg = styled(snowflake)`
  height: 90px;
  top: 35px;
  right: -57px;
  transform: rotate(-19deg);
  ${MEDIA.DESKTOP`
    height: 292px;
    top: 85px;
    right: -142px;
    transform: unset;
  `}
  position: absolute;
`
const ScSnowflakeRelatedArticlesBg = styled(snowflake)`
  height: 150px;
  top: 22px;
  left: -76px;
  transform: rotate(-19deg);
  ${MEDIA.DESKTOP`
    height: 352px;
    top: -70px;
    left: -143px;
    transform: unset;
  `}
  position: absolute;
`
const ScSnowflakeRelatedArticlesBg2 = styled(snowflake)`
  height: 150px;
  top: 680px;
  right: -106px;
  transform: rotate(-15deg);
  position: absolute;
`
const ScYellowSparkleBg = styled(relatedArticlesIcon)`
  height: 89px;
  top: -41px;
  left: -36px;
  ${MEDIA.DESKTOP`
    height: 187px;
    top: -145px;
    left: 43px;
  `}
  position: absolute;
`
const ScBranchHostBg = styled(branch)`
  height: 104px;
  top: 240px;
  right: -54px;
  transform: rotate(180deg);
  ${MEDIA.DESKTOP`
    height: 237px;
    top: 250px;
    right: -76px;
  `}
  position: absolute;
`
const ScBranchGiveawaysBg = styled(branch)`
  height: 137px;
  top: -102px;
  left: 0;
  transform: rotate(180deg);
  ${MEDIA.DESKTOP`
    height: 278px;
    top: -192px;
    left: 79px;
  `}
  position: absolute;
`
const ScMessengerButton = styled(messengerButton)`
  height: 50px;
  width: 50px;
  fill: ${COLORS.LT_DARK_GREY_BLUE};

  ${MEDIA.DESKTOP` 
    &:hover {
      fill: ${COLORS.LT_SUN_YELLOW};
      cursor: pointer;
    }
  `}

  &:active {
    fill: ${COLORS.LT_DARK_SUN_YELLOW};
  }
`

const renderer = new marked.Renderer()
renderer.link = markedLink

const messengerClick = (locale) => {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set('language', locale)
  const shareURL = `${window.location.origin}${window.location.pathname}?${urlParams}`
  facebookSend(shareURL)
}

const WebinarPage = ({ webinar }) => {
  const RSVPRef = useRef()
  const shareRef = useRef()
  const { isMobile } = useContext(DetectDeviceContext)
  const { translator, locale } = useTranslator()

  dateformat.i18n.monthNames = translator('Webinar.monthNames')
  dateformat.masks.withOfMonth =
    locale === 'es' ? 'UTC:d "de" mmm, yyyy' : 'UTC:mmm dS, yyyy'

  const date = dateformat(new Date(webinar.date), 'withOfMonth')
  const startTime = dateformat(new Date(webinar.date), 'UTC:h tt')
  const endTime = webinar.endDate
    ? dateformat(new Date(webinar.endDate), 'UTC:h tt')
    : null
  const schedule = get(webinar, 'scheduleCollection.items', [])
  const relatedArticles = get(webinar, 'relatedPostsCollection.items', [])
  const slotList = isMobile ? ['footer'] : []
  const webinarId = get(webinar, 'webinarId', null)
  const callToAction = get(webinar, 'callToAction', '')
  const swagBags = get(webinar, 'swagBags', '')
  const giveaways = get(webinar, 'giveaways', '')

  return (
    <Layout>
      <AdProviderWrapper slotList={slotList} reset={webinar.slug}>
        <DocumentHead
          key={getDocumentHeadKey(locale, 'webinar')}
          title={webinar.name}
          image={webinar.logo}
          seoDescription={webinar.description}
        />
        <ScFlexWrapper>
          <ScHeader>
            <ScBgWrapper>
              <ScSnowflakeHeaderBg />
            </ScBgWrapper>
            <ScLogo src={webinar.logo.url} alt='' />
            <ScName>{webinar.name}</ScName>
          </ScHeader>
          <ScSection>
            <ScDate>{date}</ScDate>
            {startTime && endTime && (
              <ScTime>
                {startTime} - {endTime} EST
              </ScTime>
            )}
            <ScDescription>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked(webinar.description, { renderer }),
                }}
              />
            </ScDescription>
            <ScRegisterButton
              onClick={() => {
                RSVPRef.current.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {translator('Webinar.registerNow')}
            </ScRegisterButton>
            {callToAction && (
              <ScText>
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(callToAction, { renderer }),
                  }}
                />
              </ScText>
            )}
          </ScSection>
          <ScSection>
            <ScBgWrapper>
              <ScYellowSparkleBg />
              <ScBranchHostBg />
            </ScBgWrapper>
            <ScHostIcon />
            <ScHostLineIcon />
            <ScH2Header>{translator('Webinar.speakers')}</ScH2Header>
            <Speaker speakers={webinar.speakersCollection.items} />
          </ScSection>
          <ScSection ref={RSVPRef}>
            <ScBgWrapper>
              <ScSnowflakeRsvpBg />
            </ScBgWrapper>
            <RSVPForm
              shareRef={shareRef}
              RSVPRef={RSVPRef}
              webinarId={webinarId}
              messengerClick={messengerClick}
            />
          </ScSection>
          {!isEmpty(schedule) && (
            <ScSection>
              <ScH2Header>{translator('Webinar.schedule')}</ScH2Header>
              <Schedule schedules={webinar.scheduleCollection.items}></Schedule>
            </ScSection>
          )}
          {swagBags && (
            <ScSection>
              <ScH2Header>{translator('Webinar.swagBags')}</ScH2Header>
              <ScDescription>
                <ScMarkdown
                  dangerouslySetInnerHTML={{
                    __html: marked(swagBags, { renderer }),
                  }}
                />
              </ScDescription>
            </ScSection>
          )}
          {giveaways && (
            <ScSection>
              <ScBgWrapper>
                <ScBranchGiveawaysBg />
                <ScSnowflakeGiveawaysBg />
              </ScBgWrapper>
              <ScGiveawaysIcon />
              <ScH2Header>{translator('Webinar.giveAways')}</ScH2Header>
              <ScDescription>
                <ScMarkdown
                  dangerouslySetInnerHTML={{
                    __html: marked(giveaways, { renderer }),
                  }}
                />
              </ScDescription>
              <ScGiveawaysLineIcon />
            </ScSection>
          )}
          {!isEmpty(relatedArticles) && (
            <ScSection>
              <ScBgWrapper>
                <ScSnowflakeRelatedArticlesBg />
                {isMobile && <ScSnowflakeRelatedArticlesBg2 />}
              </ScBgWrapper>
              <ScRelatedArticlesIcon />
              <ScH2Header>{translator('Webinar.relatedArticles')}</ScH2Header>
              <RelatedArticles posts={relatedArticles} />
            </ScSection>
          )}
          <ScSection ref={shareRef}>
            <ScH2Header>{translator('Webinar.share')}</ScH2Header>
            <ScMessengerButton
              onClick={() => {
                messengerClick(locale)
              }}
            />
          </ScSection>
          <ScSection>
            <ScH2Header>{translator('Webinar.pastWebinars')}</ScH2Header>
            <ScDescription>
              The Happiest You Live!
              <br />
              23rd January 2021
            </ScDescription>
          </ScSection>
        </ScFlexWrapper>
        <ScBackgroundBox />
        <AdFooter />
      </AdProviderWrapper>
    </Layout>
  )
}

WebinarPage.propTypes = {
  webinar: PropTypes.object.isRequired,
}

export default WebinarPage
