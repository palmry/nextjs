import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useTranslator } from '../../hooks/useTranslator'
import { DefaultButton } from './DefaultButton'
import IconNavLeft from '../../statics/images/icon-nav-left.svg'
import { withButton, MEDIA } from '../../utils/styles'

const ScImageBox = styled.div`
  display: inline;

  ${(props) => props.marginRight && `margin-right: ${props.marginRight};`}
  ${(props) => props.marginLeft && `margin-left: ${props.marginLeft};`}
`

const ScSeeMoreButton = styled(({ isOutlined, ...restProps }) => (
  <DefaultButton {...restProps} />
)).attrs({
  className: (props) =>
    props.isOutlined
      ? 'font-button withButtonOutlined'
      : 'font-button withButtonLight',
})`
  && {
    font-weight: 500;
    text-transform: uppercase;
    max-width: 9.38rem;
    ${withButton}

    ${MEDIA.TABLET`max-width: 18.50rem;`}
    ${MEDIA.DESKTOP`max-width: 21.50rem;`}

    svg {
      height: 0.56rem;
      width: 0.56rem;
    }
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SPACING = '0.38rem'

const SeeMoreButton = ({
  url,
  prefixTitle,
  prefixImageComponent,
  suffixImageComponent,
  isOutlined,
}) => {
  const { translator } = useTranslator()
  const buttonTitle = `${translator(prefixTitle)}`

  return (
    // <IconNavLeft /> does not display a text with vertical center alignment on Chrome browser on Windows OS.
    // We won't change it because it will be broken on other devices when we fixed it by adding vertical-align CSS property with <span>
    // Ref: MOMCOM-535.
    <ScSeeMoreButton isOutlined={isOutlined} to={url}>
      {prefixImageComponent && (
        <ScImageBox marginRight={SPACING}>{prefixImageComponent}</ScImageBox>
      )}
      {buttonTitle}
      {suffixImageComponent && (
        <ScImageBox marginLeft={SPACING}>{suffixImageComponent}</ScImageBox>
      )}
    </ScSeeMoreButton>
  )
}

SeeMoreButton.propTypes = {
  url: PropTypes.string.isRequired,
  prefixTitle: PropTypes.string,
  prefixImageComponent: PropTypes.node,
  suffixImageComponent: PropTypes.node,
  isOutlined: PropTypes.bool,
}
SeeMoreButton.defaultProps = {
  prefixTitle: 'global.seeMore',
  prefixImageComponent: null,
  suffixImageComponent: <IconNavLeft />,
  isOutlined: false,
}

export default SeeMoreButton
