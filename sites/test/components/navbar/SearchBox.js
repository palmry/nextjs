import React, { forwardRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { searchBarTransitionStyle } from './sharedStyles'
import { COLORS, MEDIA } from '../../utils/styles'

const ScSearchInput = styled.input.attrs({
  className: 'font-small-body',
})`
  background: transparent;
  padding-right: 10px;
  padding-left: 15px;
  border: none;
  height: 100%; /* fit with parent */

  /* reserve space for search-button */
  width: 90%;

  ${MEDIA.TABLET`width: 95%;`}
  ${MEDIA.DESKTOP`width: 95%;`}

  ${searchBarTransitionStyle}
`
export const OverlayBox = styled.div`
  /* always absolute with its parent */
  position: absolute;
  background: ${COLORS.BLACK};
  opacity: 0.5;
  width: 100%;
  height: 100vh;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SearchBox = props => {
  return <ScSearchInput ref={props.forwardedRef} placeholder="Search" {...props} />
}

export const ForwardRefSearchBox = forwardRef((props, ref) => (
  <SearchBox {...props} forwardedRef={ref} />
))

SearchBox.propTypes = {
  styleState: PropTypes.string,
  forwardedRef: PropTypes.any.isRequired,
}
SearchBox.defaultProps = {
  styleState: null,
}

export default SearchBox
