import React, { useContext } from 'react'
import styled from 'styled-components'
import { WelcomeBannerStateContext } from '../context/WelcomeBannerProvider'
import { ReactComponent as CloseIcon } from '../../statics/images/icon-close.svg'
import { FONT_FAMILIES, MEDIA, NAVIGATION_BAR_HEIGHT, COLORS } from '../../utils/styles'
import Link from 'wsc/components/Link'
import { useCookies } from 'react-cookie'
import { useTranslator } from '../../hooks/useTranslator'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

const ScWrapper = styled.div`
  position: fixed;
  z-index: 5;
  bottom: 0px;
  width: 100%;
  height: 100px;
  ${MEDIA.MOBILE_S`
    height: 127px;
  `}
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.LT_DARK_GREY_BLUE};
  opacity: 0.9;
  ${MEDIA.MOBILE`
  top: 0px;
  transform: translateY(${NAVIGATION_BAR_HEIGHT}px);
  transition: transform 0.3s ease-out;
    ${props =>
      props.isMoveWelcomeBar &&
      `
      transform: translateY(0px);
      transition: transform 0.3s ease-out;
    `}
  `}

  ${props =>
    props.isHideWelcomeBar &&
    `
    display: none;
  `}
`
const ScCloseIcon = styled(CloseIcon)`
  height: 12px;
  width: 12px;
  position: absolute;
  top: 10px;
  right: 10px;
  fill: ${COLORS.WHITE};
`
const ScContainer = styled.div`
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 1rem;
  color: ${COLORS.WHITE};
  ${MEDIA.MOBILE`
    padding: 0 23px;
  `}
`
const ScSpan = styled.span`
  font-weight: bold;
  font-style: italic;
`
const ScLink = styled(Link)`
  color: ${COLORS.WHITE};
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const WelcomeBanner = () => {
  const [, setCookie] = useCookies(['cm-betaSite'])
  const { isHideWelcomeBar, setIsHideWelcomeBar, isMoveWelcomeBar } = useContext(
    WelcomeBannerStateContext
  )
  const { translator } = useTranslator()
  const { isMobile_S } = useContext(DetectDeviceContext)

  return (
    <ScWrapper isMoveWelcomeBar={isMoveWelcomeBar} isHideWelcomeBar={isHideWelcomeBar}>
      <ScCloseIcon
        onClick={() => {
          setIsHideWelcomeBar(true)
        }}
      />
      <ScContainer>
        <ScSpan>{translator('welcomeBanner.bannerText1')}</ScSpan>
        {isMobile_S ? <br /> : ' '}
        {translator('welcomeBanner.bannerText2')}
        {isMobile_S ? <br /> : ' '}
        <ScLink
          to={'https://www.littlethings.com'}
          isOpenNewTab={false}
          onClick={() => {
            setCookie('lt-betaSite', 0, { domain: '.littlethings.com' })
            //send GA data through GTM
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
              event: 'onGoBack',
            })
          }}
        >
          {translator('welcomeBanner.goBack')}
        </ScLink>
        .
      </ScContainer>
    </ScWrapper>
  )
}

WelcomeBanner.propTypes = {}

WelcomeBanner.defaultProps = {}

export default WelcomeBanner
