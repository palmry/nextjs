import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Link from 'wsc/components/Link'
import { MEDIA, COLORS } from '../../utils/styles'
import { ReactComponent as IconNavLeft } from '../../statics/images/icon-nav-left.svg'

const ScCopyContainer = styled.div`
  text-align: center;
`
const ScCopyText = styled.p`
  margin: 0 auto 1rem;
  max-width: 23rem;
  ${MEDIA.TABLET`max-width: 28.25rem;`}
  ${MEDIA.DESKTOP`max-width: 33.5rem;`}
`
const ScLinkDiv = styled.div`
  font-size: 0.75rem;
  ${MEDIA.TABLET`font-size: 0.75‬rem;`}
  ${MEDIA.DESKTOP`font-size: 0.69rem;`}
`
const ScLink = styled(Link)`
  border: none;
  color: ${COLORS.GREY};
  text-transform: uppercase;

  &:active {
    color: ${COLORS.LT_DARK_GREY_BLUE};
    svg {
      fill: ${COLORS.LT_DARK_GREY_BLUE};
    }
  }

  ${MEDIA.DESKTOP`
    &:hover {
      color: ${COLORS.LT_DARK_GREY_BLUE};
      svg {
        fill: ${COLORS.LT_DARK_GREY_BLUE};
      }
    }
  `}
`
const ScSvgBox = styled.div`
  display: inline;
  margin-left: 0.38rem;
  svg {
    height: 0.47rem;
    width: 0.47rem;
    fill: ${COLORS.GREY};
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const NotFoundCopyText = ({ title, description }) => {
  return (
    <ScCopyContainer>
      <h1>{title}</h1>
      <ScCopyText>{description}</ScCopyText>
      <ScLinkDiv>
        <ScLink to="/">
          <span>Go home</span>
          <ScSvgBox>
            <IconNavLeft />
          </ScSvgBox>
        </ScLink>
      </ScLinkDiv>
    </ScCopyContainer>
  )
}

NotFoundCopyText.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

NotFoundCopyText.defaultProps = {
  title: null,
  description: null,
}

export default NotFoundCopyText
