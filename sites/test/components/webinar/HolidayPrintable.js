import React, { useContext, useRef } from 'react'
import get from 'lodash/get'
import Layout from '../Layout'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import DocumentHead from '../DocumentHead'
import HolidayForm from './HolidayForm'
import { COLORS, MEDIA } from '../../utils/styles'
import styled from 'styled-components'
import { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import marked from 'marked'
import { markedLink } from 'wsc/utils/redirect'
import { facebookSend } from 'wsc/utils/socialShare'
import AdProviderWrapper from '../AdProviderWrapper'
import AdFooter from 'wsc/components/AdFooter'

import messengerButton from '../../statics/images/icon-messenger.svg'
import ICON_1 from 'wsc/statics/images/holiday/icon1.svg'
import ICON_2 from 'wsc/statics/images/holiday/icon2.svg'
import ICON_3 from 'wsc/statics/images/holiday/icon3.svg'

const ScFlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${MEDIA.DESKTOP`
    margin-left: auto;
    margin-right: auto;
  `}
`
const ScHeader = styled.div`
  position: relative;
  ${MEDIA.DESKTOP`
    width: 904px;
  `}
`
const ScLogo = styled.img`
  display: block;
  width: auto;
  height: 81px;
  margin: 50px auto 30px;
  ${MEDIA.TABLET`
    height: 67px;
  `}
  ${MEDIA.MOBILE`
    height: 48px;
  `}
`
const ScName = styled.h1`
  color: ${COLORS.HOLIDAY_RED};
  text-align: center;
  text-transform: uppercase;
`
const ScSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 50px;
  ${MEDIA.DESKTOP`
    margin-bottom: 70px;
  `}
`
const ScIcon1 = styled.img`
  width: 100px;
  margin-bottom: 30px;
  ${MEDIA.TABLET`
    width: 130px;
  `}
  ${MEDIA.DESKTOP`
    width: 150px;
  `}
`
const ScDescription = styled.div`
  ${defaultLinkStyleToUseInMD}
  text-align: center;
  color: ${COLORS.BLACK};
  ${MEDIA.DESKTOP`
    width: 904px;
  `}

  a {
    border-bottom: 0.125rem solid ${COLORS.BLACK};

    ${MEDIA.DESKTOP` 
      &:hover {
        border-bottom: 0.125rem solid ${COLORS.HOLIDAY_DARK_ORANGE};
        color: ${COLORS.HOLIDAY_DARK_ORANGE};
        cursor: pointer;
      }
    `}

    &:active {
      border-bottom: 0.125rem solid ${COLORS.HOLIDAY_DARK_ORANGE};
      color: ${COLORS.HOLIDAY_DARK_ORANGE};
    }
  }
`
const ScRegisterButton = styled.div`
  border-radius: 22px;
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
  background-color: ${COLORS.HOLIDAY_GREEN};
  ${MEDIA.DESKTOP` 
    &:hover {
      background-color: ${COLORS.HOLIDAY_SOFT_GREEN};
      cursor: pointer;
    }
  `}

  &:active {
    background-color: ${COLORS.HOLIDAY_SOFT_GREEN};
  }
`
const ScH2Header = styled.h2`
  color: ${COLORS.HOLIDAY_BROWN};
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: bold;
`
const ScIcon2 = styled.img`
  width: 60px;
  margin-top: 50px;
  margin-bottom: 20px;
  ${MEDIA.TABLET`
    width: 80px;
  `}
  ${MEDIA.DESKTOP`
    width: 100px;
    margin-top: 70px;
  `}
`
const ScPrintableImage = styled.img`
  height: auto;
  width: 100%;

  ${MEDIA.DESKTOP`
    width: 534px;
  `}

  ${MEDIA.TABLET`
    width: 454px;
  `}
`
const ScIcon3 = styled.img`
  margin-bottom: 20px;
  width: 60px;
  ${MEDIA.TABLET`
    width: 80px;
  `}
  ${MEDIA.DESKTOP`
    width: 100px;
  `}
`
const ScBgWrapper = styled.div`
  width: 100vw;
  height: 100%;
  position: absolute;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow-x: clip;
  z-index: -1;
  background-color: ${COLORS.HOLIDAY_SOFT_BROWN};
}`
const ScMessengerButton = styled(messengerButton)`
  height: 50px;
  width: 50px;
  fill: ${COLORS.HOLIDAY_GREEN};

  ${MEDIA.DESKTOP` 
    &:hover {
      fill: ${COLORS.HOLIDAY_SOFT_GREEN};
      cursor: pointer;
    }
  `}

  &:active {
    fill: ${COLORS.HOLIDAY_SOFT_GREEN};
  }
`

const renderer = new marked.Renderer()
renderer.link = markedLink

const messengerClick = () => {
  facebookSend()
}

const HolidayPrintablePage = ({ webinar }) => {
  const RSVPRef = useRef()
  const shareRef = useRef()
  const { isMobile } = useContext(DetectDeviceContext)

  const slotList = isMobile ? ['footer'] : []
  const printableImage = get(webinar, 'printableImage.url', '')

  return (
    <Layout>
      <AdProviderWrapper slotList={slotList} reset={webinar.slug}>
        <DocumentHead
          key={'webinar-holiday'}
          title={webinar.name}
          ogImage={{
            url: printableImage,
            title: webinar.title,
          }}
          isContentfulImage={false}
          seoDescription={webinar.description}
        />
        <ScFlexWrapper>
          <ScBgWrapper></ScBgWrapper>
          <ScHeader>
            <ScLogo src={webinar.logo.url} alt='' />
            <ScName>{webinar.name}</ScName>
          </ScHeader>
          <ScSection>
            <ScIcon1 src={ICON_1} />
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
            <ScIcon2 src={ICON_2} />
            <ScH2Header>Festive Holiday Printables!</ScH2Header>
            {printableImage && (
              <ScPrintableImage src={printableImage} alt='Printable Image' />
            )}
          </ScSection>
          <ScIcon3 src={ICON_3} />
          <ScSection ref={RSVPRef}>
            <HolidayForm
              shareRef={shareRef}
              RSVPRef={RSVPRef}
              getResponseListToken={webinar.getResponseListToken}
              title={webinar.name}
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

HolidayPrintablePage.propTypes = {
  webinar: PropTypes.object.isRequired,
}

export default HolidayPrintablePage
