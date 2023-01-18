import React, { useContext, useRef } from 'react'
import Layout from '../Layout'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import DocumentHead from '../DocumentHead'
import ValentineForm from './ValentineForm'
import { COLORS, MEDIA, withFullWidth } from '../../utils/styles'
import styled from 'styled-components'
import { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import marked from 'marked'
import { markedLink } from 'wsc/utils/redirect'
import { facebookSend } from 'wsc/utils/socialShare'
import AdProviderWrapper from '../AdProviderWrapper'
import AdFooter from 'wsc/components/AdFooter'
import { useTranslator } from '../../hooks/useTranslator'
import { getDocumentHeadKey } from 'wsc/utils/common'
import ResponsiveImage from '../ResponsiveImage'

import messengerButton from '../../statics/images/icon-messenger.svg'
import PINK_HEART from 'wsc/statics/images/valentine/pink-heart.png'
import WHITE_HEART from 'wsc/statics/images/valentine/white-heart.png'
import PRINTABLE_VALENTINE from 'wsc/statics/images/valentine/printable-valentine.png'
import HEART_SUNNIES from 'wsc/statics/images/valentine/heart-sunnies.png'

import { getConfig } from 'wsc/globalConfig'
const APP_CONFIGS = getConfig('AppConfig')

const ScFlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${MEDIA.DESKTOP`
    margin-left: auto;
    margin-right: auto;
  `}
`
const ScBackgroundBox = styled.div`
  && {
    position: absolute;
  }

  background-color: ${COLORS.VALENTINE_LIGHT_PINK};
  top: 0;
  z-index: -2;
  height: 100%;
  width: 100%;
  ${withFullWidth}
`
const ScLogo = styled.img`
  display: block;
  width: auto;
  height: 68px;
  margin: 46px auto 53px;
  ${MEDIA.DESKTOP`
    height: 81px;
    margin: 64px auto 85px;
  `}
`
const ScName = styled.h1`
  color: ${COLORS.VALENTINE_DARK_PINK};
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
  min-width: 300px;
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
  background-color: ${COLORS.VALENTINE_PINK};
  ${MEDIA.DESKTOP` 
    &:hover {
      background-color: ${COLORS.VALENTINE_DARK_PINK};
      cursor: pointer;
    }
  `}

  &:active {
    background-color: ${COLORS.VALENTINE_DARK_PINK};
  }
`
const ScH2Header = styled.h2`
  color: ${COLORS.VALENTINE_DARK_PINK};
  text-transform: uppercase;
  margin-bottom: 20px;
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
const ScPinkHeartHeaderImage = styled.img`
  position: absolute;
  height: 90px;
  top: 70px;
  right: -15px;
  transform: rotate(-16deg);
  ${MEDIA.DESKTOP`
    height: 180px;
    top: 80px;
    right: -50px;
    transform: rotate(-15deg);
  `}
`
const ScWhiteHeartHeaderImage = styled.img`
  position: absolute;
  height: 55px;
  top: 100px;
  left: 10px;
  transform: rotate(10deg);
  ${MEDIA.DESKTOP`
    height: 140px;
    top: 315px;
    left: 10px;
    transform: rotate(30deg);
  `}
`
const ScHeartSunniesIcon = styled.img`
  height: 120px;
  transform: rotate(-20deg);
  ${MEDIA.DESKTOP`
    height: 170px;
    transform: rotate(0deg);
  `}
`
const ScPrintableValentineImageWrapper = styled.div`
  ${MEDIA.DESKTOP`
    margin-top: 15px;
    margin-bottom: 20px;
  `}
`
const ScPinkHeartPrintableImage = styled.img`
  position: absolute;
  transform: rotate(-20deg);
  height: 90px;
  top: -170px;
  left: -15px;

  ${MEDIA.MOBILE_S`
    height: 80px;
    top: -150px;
  `}

  ${MEDIA.DESKTOP`
    height: 240px;
    top: -50px;
    left: 30px;
  `}
`

const ScWhiteHeartPrintableImage = styled.img`
  position: absolute;
  transform: rotate(16deg);
  height: 70px;
  top: -240px;
  right: -10px;

  ${MEDIA.MOBILE_S`
    height: 60px;
    top: -160px;
  `}

  ${MEDIA.DESKTOP`
    height: 180px;
    top: -120px;
    right: -10px;
  `}
`
const ScMessengerButton = styled(messengerButton)`
  height: 50px;
  width: 50px;
  fill: ${COLORS.VALENTINE_PINK};

  ${MEDIA.DESKTOP` 
    &:hover {
      fill: ${COLORS.VALENTINE_DARK_PINK};
      cursor: pointer;
    }
  `}

  &:active {
    fill: ${COLORS.VALENTINE_DARK_PINK};
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

const ValentinePage = ({ webinar }) => {
  const RSVPRef = useRef()
  const shareRef = useRef()
  const { isDesktop, isTablet, isMobile } = useContext(DetectDeviceContext)
  const { translator, locale } = useTranslator()

  const slotList = isMobile ? ['footer'] : []

  return (
    <Layout>
      <AdProviderWrapper slotList={slotList} reset={webinar.slug}>
        <DocumentHead
          key={getDocumentHeadKey(locale, 'webinar-valentine-day')}
          title={webinar.name}
          ogImage={{
            url: APP_CONFIGS.envUrl + PRINTABLE_VALENTINE,
            title: webinar.title,
          }}
          isContentfulImage={false}
          seoDescription={webinar.description}
        />
        <ScFlexWrapper>
          <ScHeader>
            <ScBgWrapper>
              <ScWhiteHeartHeaderImage src={WHITE_HEART} />
              <ScPinkHeartHeaderImage src={PINK_HEART} />
            </ScBgWrapper>
            <ScLogo src={webinar.logo.url} alt='' />
            <ScName>{webinar.name}</ScName>
          </ScHeader>
          <ScSection>
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
              GET MY PRINTABLES
            </ScRegisterButton>
            <ScHeartSunniesIcon src={HEART_SUNNIES} />
            <ScH2Header>PRINTABLE VALENTINES</ScH2Header>
            <ScPrintableValentineImageWrapper>
              <ScBgWrapper>
                <ScPinkHeartPrintableImage src={PINK_HEART} />
                <ScWhiteHeartPrintableImage src={WHITE_HEART} />
              </ScBgWrapper>
              <ResponsiveImage
                title={'Printable Valentine'}
                src={PRINTABLE_VALENTINE}
                fixedWidth={isDesktop ? '536px' : isTablet ? '608px' : null}
              />
            </ScPrintableValentineImageWrapper>
          </ScSection>

          <ScSection ref={RSVPRef}>
            <ValentineForm
              shareRef={shareRef}
              RSVPRef={RSVPRef}
              messengerClick={messengerClick}
              title={webinar.name}
            />
          </ScSection>

          <ScSection ref={shareRef}>
            <ScH2Header>{translator('Webinar.share')}</ScH2Header>
            <ScMessengerButton
              onClick={() => {
                messengerClick(locale)
              }}
            />
          </ScSection>
        </ScFlexWrapper>
        <ScBackgroundBox />
        <AdFooter />
      </AdProviderWrapper>
    </Layout>
  )
}

ValentinePage.propTypes = {
  webinar: PropTypes.object.isRequired,
}

export default ValentinePage
