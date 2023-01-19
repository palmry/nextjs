import React, { useContext } from 'react'
import styled from 'styled-components'
import LOGO_YELLOW from '../../statics/images/logo-lt-allyellow.svg'
import {
  MEDIA,
  COLORS,
  PADDINGS,
  PAGE_WIDTHS,
  FONT_FAMILIES,
} from '../../utils/styles'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { useTranslator } from '../../hooks/useTranslator'
import FooterSocial from './FooterSocial'
import FooterContact from './FooterContact'
import FooterProduct from './FooterProduct'

const ScWrapper = styled.div`
  position: relative;
  text-align: center;
  padding: 50px 0;
  background: ${COLORS.LT_DARK_GREY_BLUE};
  ${MEDIA.MOBILE`
    padding: 40px 0px 140px 0px;
  `}
`

const ScContainer = styled.div`
  margin: 0 auto;
  ${MEDIA.MOBILE`
  padding-left: ${PADDINGS.DEFAULT.MOBILE}px;
  padding-right: ${PADDINGS.DEFAULT.MOBILE}px;
`}
  ${MEDIA.TABLET`width: ${PAGE_WIDTHS.TABLET}px;`}
${MEDIA.DESKTOP`width: ${PAGE_WIDTHS.DESKTOP}px;`}
`

const ScLogoImg = styled.img`
  height: 72px;
  ${MEDIA.MOBILE`height: 51px;`}
`

const ScTitle = styled.div`
  color: ${COLORS.WHITE};
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 0.94rem;
  line-height: 1.25rem;
  margin-top: 30px;
  ${MEDIA.MOBILE`
    font-size: 1rem;
    line-height: 1.31rem;
    margin-top: 24px;
  `}
`

const ScSeparator = styled.hr`
  width: 100%;
  background-color: ${COLORS.WHITE};
  margin: 30px 0;

  ${MEDIA.DESKTOP`
    margin: 40px 0;
  `};
`

const ScUnderSeparatorDiv = styled.div.attrs({
  className: 'font-description',
})`
  color: ${COLORS.WHITE};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  font-size: 0.75rem;
  line-height: 1.25rem;
  letter-spacing: 0.05rem;

  ${MEDIA.DESKTOP`
  font-size: 0.69rem;
  line-height: 0.9375rem;
    letter-spacing: 0.04rem;
  `}
`

const ScCorpDetail = styled.div`
  flex-grow: 1;
  text-align: center;
  color: ${COLORS.WHITE};
  ${MEDIA.MOBILE`
    flex-basis: 100%;
  `}
  ${MEDIA.TABLET`
    flex-basis: 100%;
  `}
  ${MEDIA.DESKTOP`
    text-align: right;
    margin-bottom: 0px;
  `}
  ${(props) => props.order && `order: ${props.order};`}
`

const ScParentCompany = styled(ScCorpDetail)`
  font-weight: bold;
  margin-top: 1.5rem;
  text-align: center;

  ${MEDIA.DESKTOP`
    margin-top: .75rem;
    text-align: center;
  `}
`
/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const Footer = () => {
  const { isDesktop, isMobile_S } = () => useContext(DetectDeviceContext)
  const { translator } = useTranslator()
  const currentYear = new Date().getFullYear()

  return (
    <ScWrapper>
      <ScContainer>
        {/* CM icon */}
        <ScLogoImg src={LOGO_YELLOW} />

        {/* Title */}
        <ScTitle>{translator('footer.missionStatement')}</ScTitle>

        {/* Social button */}
        <FooterSocial />

        {/* Seperator */}
        <ScSeparator />

        <ScUnderSeparatorDiv>
          {/* Contact link list */}
          <FooterContact />

          {/* Wild Sky Media corperation detail*/}
          <ScCorpDetail order={2}>
            © {currentYear} WILD SKY MEDIA.{isMobile_S ? <br /> : ' '}ALL RIGHTS
            RESERVED.
          </ScCorpDetail>
          <ScCorpDetail order={isDesktop ? 4 : 3}>
            {translator('footer.credit')} {isMobile_S ? <br /> : '|'}{' '}
            {translator('footer.creditFamily')}
          </ScCorpDetail>

          {/* All Product link */}
          <FooterProduct />

          {/* Ownership Disclosure */}
          <ScParentCompany order={5}>
            This site is owned and operated by Bright Mountain Media, Inc., a
            publicly owned company trading with the symbol: BMTM.
          </ScParentCompany>
        </ScUnderSeparatorDiv>
      </ScContainer>
    </ScWrapper>
  )
}

Footer.propTypes = {}

Footer.defaultProps = {}

export default Footer
