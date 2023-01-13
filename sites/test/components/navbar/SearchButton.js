import React from 'react'
import { ScIconButton, ScIconImg } from './sharedStyles'
import ICON_SEARCH from '../../statics/images/icon-search.svg'

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SearchButton = props => (
  <ScIconButton color="inherit" {...props}>
    <ScIconImg src={ICON_SEARCH} />
  </ScIconButton>
)

export default SearchButton
