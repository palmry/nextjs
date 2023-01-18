import React, { useContext, useRef } from 'react'
import Layout from '../Layout'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import DocumentHead from '../DocumentHead'
import MothersDayForm from './MothersDayForm'
import { COLORS, MEDIA } from '../../utils/styles'
import styled from 'styled-components'
import { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import marked from 'marked'
import { markedLink } from 'wsc/utils/redirect'
import { facebookSend } from 'wsc/utils/socialShare'
import AdProviderWrapper from '../AdProviderWrapper'
import AdFooter from 'wsc/components/AdFooter'
import ResponsiveImage from '../ResponsiveImage'

import messengerButton from '../../statics/images/icon-messenger.svg'
import PRINTABLE_VALENTINE from 'wsc/statics/images/mothersDay/printable-mothersday.jpg'
import TULIP from 'wsc/statics/images/mothersDay/tulip.svg'

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
const ScLogo = styled.img`
  display: block;
  width: auto;
  height: 80px;
  margin: 50px auto 30px;
  ${MEDIA.TABLET`
    height: 70px;
  `}
  ${MEDIA.MOBILE`
    height: 50px;
  `}
`
const ScName = styled.h1`
  color: ${COLORS.MOTHERS_DAY_PINK};
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
  color: ${COLORS.BLACK};
  ${MEDIA.DESKTOP`
    width: 904px;
  `}
`
const ScRegisterButton = styled.div`
  border-radius: 50px;
  min-width: 270px;
  height: 44px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.87rem;
  letter-spacing: 0.84px;
  text-transform: uppercase;
  font-weight: 600;
  user-select: none;
  color: ${COLORS.WHITE};
  background-color: ${COLORS.MOTHERS_DAY_GREEN};
  ${MEDIA.DESKTOP` 
    &:hover {
      background-color: ${COLORS.MOTHERS_DAY_DARK_PINK};
      cursor: pointer;
    }
  `}

  &:active {
    background-color: ${COLORS.MOTHERS_DAY_PINK};
  }
`
const ScH2Header = styled.h2`
  color: ${COLORS.MOTHERS_DAY_PINK};
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: bold;
`
const ScBgWrapper = styled.div`
  width: 100vw;
  position: absolute;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow-x: clip;
}`
const ScYellowBlur = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  background-color: ${COLORS.MOTHERS_DAY_YELLOW};
  ${MEDIA.DESKTOP`
    top: -160px;
    left: -200px;
    width: 900px;
    height: 800px;
  `}
  ${MEDIA.TABLET`
    top: -80px;
    left: -30px;
    width: 400px;
    height: 400px;
  `}
  ${MEDIA.MOBILE`
    top: -60px;
    left: -40px;
    width: 300px;
    height: 300px;
  `}
`
const ScPinkBlur = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  background-color: ${COLORS.MOTHERS_DAY_PINK};
  ${MEDIA.DESKTOP`
    top: 300px;
    left: -60px;
    width: 450px;
    height: 450px;
  `}
  ${MEDIA.TABLET`
    top: 120px;
    left: -60px;
    width: 270px;
    height: 270px;
  `}
  ${MEDIA.MOBILE`
    top: 80px;
    left: -30px;
    width: 180px;
    height: 180px;
  `}
`
const ScTulipIcon = styled.img`
  height: 80px;
  margin-top: 50px;
  margin-bottom: 30px;

  ${MEDIA.DESKTOP`
    height: 104px;
    margin-top: 70px;
    margin-bottom: 20px;
  `}
`
const ScMessengerButton = styled(messengerButton)`
  height: 50px;
  width: 50px;
  fill: ${COLORS.MOTHERS_DAY_GREEN};

  ${MEDIA.DESKTOP` 
    &:hover {
      fill: ${COLORS.MOTHERS_DAY_DARK_PINK};
      cursor: pointer;
    }
  `}

  &:active {
    fill: ${COLORS.MOTHERS_DAY_PINK};
  }
`

const renderer = new marked.Renderer()
renderer.link = markedLink

const messengerClick = () => {
  facebookSend()
}

const MothersDayPage = ({ webinar }) => {
  const RSVPRef = useRef()
  const shareRef = useRef()
  const { isDesktop, isTablet, isMobile } = useContext(DetectDeviceContext)

  const slotList = isMobile ? ['footer'] : []

  return (
    <Layout>
      <AdProviderWrapper slotList={slotList} reset={webinar.slug}>
        <DocumentHead
          key={'webinar-mothers-day'}
          title={webinar.name}
          ogImage={{
            url: APP_CONFIGS.envUrl + PRINTABLE_VALENTINE,
            title: webinar.title,
          }}
          isContentfulImage={false}
          seoDescription={webinar.description}
        />
        <ScFlexWrapper>
          <ScBgWrapper>
            <ScYellowBlur />
            <ScPinkBlur />
          </ScBgWrapper>
          <ScHeader>
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
            <ScTulipIcon src={TULIP} />
            <ScH2Header>PRINTABLE MOTHER’S DAY CARDS</ScH2Header>
            <ResponsiveImage
              title={'Printable Valentine'}
              src={PRINTABLE_VALENTINE}
              fixedWidth={isDesktop ? '536px' : isTablet ? '452px' : null}
            />
          </ScSection>

          <ScSection ref={RSVPRef}>
            <MothersDayForm
              shareRef={shareRef}
              RSVPRef={RSVPRef}
              getResponseListToken={webinar.getResponseListToken}
            />
          </ScSection>

          <ScSection ref={shareRef}>
            <ScH2Header>SHARE</ScH2Header>
            <ScMessengerButton
              onClick={() => {
                messengerClick()
              }}
            />
          </ScSection>
        </ScFlexWrapper>

        <AdFooter />
      </AdProviderWrapper>
    </Layout>
  )
}

MothersDayPage.propTypes = {
  webinar: PropTypes.object.isRequired,
}

export default MothersDayPage
