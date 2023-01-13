import isEmpty from 'lodash/isEmpty'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { MEDIA, COLORS, withResponsiveHidden } from '../utils/styles'
import { useTranslator } from '../hooks/useTranslator'
import Link from 'wsc/components/Link'
import ResponsiveImage from './ResponsiveImage'

const ScWrapper = styled.div`
  ${props =>
    withResponsiveHidden({
      hideOnDesktop: props.hideOnDesktop,
      existOnDesktop: props.existOnDesktop,
    })}
  color: ${COLORS.GREY};
  text-align: center;

  font-size: 0.75rem;
  ${MEDIA.DESKTOP`font-size: 0.69rem`}
`
const ScSponsorText = styled.span``

const ScLogoWrapper = styled.div`
  margin-left: 10px;
`

const ScUnderlineImg = styled.img`
  display: block;
  margin: 5px auto 0px;
`
const ScFlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const ScLink = styled(Link)`
  border: none;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SponsoredElement = ({ sponsor, className, ...restProps }) => {
  const { translator } = useTranslator()
  if (isEmpty(sponsor) || isEmpty(sponsor.logo)) return null

  let sponsorLogoComponent = (
    <ScLogoWrapper>
      <ResponsiveImage
        alt={sponsor.logo.title}
        title={sponsor.logo.title}
        src={sponsor.logo.url}
        maxHeight={'60px'}
        maxWidth={'170px'}
        squareSize={'auto'}
        fixedWidth={'auto'}
        squareCroppingPreference={'none'}
        resourceSizeValues={[60]}
        imgQuality={100}
        imgFormat={'png'}
      />
    </ScLogoWrapper>
  )

  if (!isEmpty(sponsor.link)) {
    sponsorLogoComponent = (
      <ScLink withDefaultStyle={false} to={sponsor.link}>
        {sponsorLogoComponent}
      </ScLink>
    )
  }

  return (
    <ScWrapper className={`${className}`} {...restProps}>
      <ScFlexWrapper>
        <ScSponsorText>{translator('global.sponsorText')}</ScSponsorText>
        {sponsorLogoComponent}
      </ScFlexWrapper>
      <ScUnderlineImg src={sponsor.underlineImage} />
    </ScWrapper>
  )
}

SponsoredElement.propTypes = {
  sponsor: PropTypes.shape({
    name: PropTypes.string,
    logo: PropTypes.shape({
      url: PropTypes.string,
    }),
    underlineImage: PropTypes.string,
    backgroundColor: PropTypes.string,
  }),
  className: PropTypes.string,
}

SponsoredElement.defaultProps = {
  sponsor: null,
  className: '',
}

export default SponsoredElement
