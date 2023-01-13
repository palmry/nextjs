import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { COLORS } from '../../utils/styles'

const ScTitleText = styled.span`
  border-bottom: 3px solid ${props => props.underlineColor};
  text-transform: uppercase;
`
const ScTitleImg = styled.img`
  vertical-align: middle;
  width: 1.1em;
  margin-left: 0.4em;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const FancyTitle = ({ suffixImg, title, className, titleClassName, underlineColor }) => (
  <div className={`${className} ${titleClassName}`}>
    <ScTitleText underlineColor={underlineColor}>{title}</ScTitleText>
    {suffixImg && <ScTitleImg src={suffixImg} />}
  </div>
)

FancyTitle.propTypes = {
  title: PropTypes.string.isRequired,
  suffixImg: PropTypes.string,
  titleClassName: PropTypes.string,
  className: PropTypes.string,
  underlineColor: PropTypes.string,
}

FancyTitle.defaultProps = {
  suffixImg: null,
  titleClassName: 'font-section-header-1',
  className: '',
  underlineColor: COLORS.LIGHT_BLUE,
}

export default FancyTitle
