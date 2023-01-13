import React from 'react'
import PropTypes from 'prop-types'
import GridList from './GridList'

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const PortionLayout = props => (
  <GridList
    column={props.isColumnDirection ? 1 : 2}
    contentSizes={props.subSection ? `${props.mainSectionSize} 1fr` : `1fr`}
    rowGap={props.rowGap}
    columnGap={props.columnGap}
  >
    {props.mainSection}
    {props.subSection}
  </GridList>
)

PortionLayout.propTypes = {
  mainSection: PropTypes.any.isRequired,
  mainSectionSize: PropTypes.string,
  subSection: PropTypes.any,
  isColumnDirection: PropTypes.bool,

  rowGap: PropTypes.string,
  columnGap: PropTypes.string,
}

PortionLayout.defaultProps = {
  subSection: null,
  mainSectionSize: '66.66%',
  isColumnDirection: false,

  rowGap: undefined,
  columnGap: undefined,
}

export default PortionLayout
