import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Link from 'wsc/components/Link'
import { ScIconImg, menuBarTransitionStyle } from './sharedStyles'
import LOGO_CM from '../../statics/images/logo-lt.svg'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

export const ScLogoLink = styled(({ styleState, ...restProps }) => <Link {...restProps} />)`
  line-height: 0;
  border: none;
  display: block;
  ${menuBarTransitionStyle}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const Logo = props => {
  const { isMobile } = useContext(DetectDeviceContext)
  return (
    <ScLogoLink to="/" styleState={props.styleState}>
      <ScIconImg src={LOGO_CM} height={isMobile ? 30 : 40} />
    </ScLogoLink>
  )
}

Logo.propTypes = {
  styleState: PropTypes.string,
}

Logo.defaultProps = {
  styleState: null,
}

export default Logo
