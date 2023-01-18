import React, { useContext, useRef } from 'react'
import get from 'lodash/get'
import Layout from '../Layout'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import DocumentHead from '../DocumentHead'
import FathersDayForm from './FathersDayForm'
import { COLORS, MEDIA } from '../../utils/styles'
import styled from 'styled-components'
import { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import marked from 'marked'
import { markedLink } from 'wsc/utils/redirect'
import { facebookSend } from 'wsc/utils/socialShare'
import AdProviderWrapper from '../AdProviderWrapper'
import AdFooter from 'wsc/components/AdFooter'

import messengerButton from '../../statics/images/icon-messenger.svg'
import LINE from 'wsc/statics/images/fathersDay/line.svg'
import HAT from 'wsc/statics/images/fathersDay/hat.svg'
import DAD from 'wsc/statics/images/fathersDay/dad.svg'

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
  color: ${COLORS.FATHERS_DAY_ORANGE};
  text-align: center;
  text-transform: uppercase;
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
const ScLineIcon = styled.img`
  height: 30px;
  margin-bottom: 30px;
  ${MEDIA.TABLET`
    height: 40px;
  `}
  ${MEDIA.DESKTOP`
    height: 50px;
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
        border-bottom: 0.125rem solid ${COLORS.FATHERS_DAY_YELLOW};
        color: ${COLORS.FATHERS_DAY_YELLOW};
        cursor: pointer;
      }
    `}

    &:active {
      border-bottom: 0.125rem solid ${COLORS.FATHERS_DAY_ORANGE};
      color: ${COLORS.FATHERS_DAY_ORANGE};
    }
  }
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
  background-color: ${COLORS.FATHERS_DAY_BLUE};
  ${MEDIA.DESKTOP` 
    &:hover {
      background-color: ${COLORS.FATHERS_DAY_YELLOW};
      cursor: pointer;
    }
  `}

  &:active {
    background-color: ${COLORS.FATHERS_DAY_ORANGE};
  }
`
const ScH2Header = styled.h2`
  color: ${COLORS.FATHERS_DAY_ORANGE};
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: bold;
`
const ScPrintableImage = styled.img`
  margin-bottom: 20px;
  height: auto;
  width: 100%;

  ${MEDIA.DESKTOP`
    width: 534px;
  `}

  ${MEDIA.TABLET`
    width: 454px;
  `}
`
const ScDadIcon = styled.img`
  height: 75px;

  ${MEDIA.DESKTOP`
    height: 100px;
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
  background-color: ${COLORS.FATHERS_DAY_SOFT_ORANGE};
}`
const ScHatIcon = styled.img`
  height: 80px;
  margin-top: 50px;
  margin-bottom: 20px;

  ${MEDIA.DESKTOP`
    height: 100px;
    margin-top: 70px;
  `}
`
const ScMessengerButton = styled(messengerButton)`
  height: 50px;
  width: 50px;
  fill: ${COLORS.FATHERS_DAY_BLUE};

  ${MEDIA.DESKTOP` 
    &:hover {
      fill: ${COLORS.FATHERS_DAY_YELLOW};
      cursor: pointer;
    }
  `}

  &:active {
    fill: ${COLORS.FATHERS_DAY_ORANGE};
  }
`

const renderer = new marked.Renderer()
renderer.link = markedLink

const messengerClick = () => {
  facebookSend()
}

const FathersDayPage = ({ webinar }) => {
  const RSVPRef = useRef()
  const shareRef = useRef()
  const { isMobile } = useContext(DetectDeviceContext)

  const slotList = isMobile ? ['footer'] : []
  const printableImage = get(webinar, 'printableImage.url', '')

  return (
    <Layout>
      <AdProviderWrapper slotList={slotList} reset={webinar.slug}>
        <DocumentHead
          key={'webinar-fathers-day'}
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
            <ScLineIcon src={LINE} />
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
            <ScHatIcon src={HAT} />
            <ScH2Header>PRINTABLE FATHER’S DAY CARDS</ScH2Header>
            {printableImage && (
              <ScPrintableImage src={printableImage} alt='Printable Image' />
            )}
            <ScDadIcon src={DAD} />
          </ScSection>

          <ScSection ref={RSVPRef}>
            <FathersDayForm
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

FathersDayPage.propTypes = {
  webinar: PropTypes.object.isRequired,
}

export default FathersDayPage
