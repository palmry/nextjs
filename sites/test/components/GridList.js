import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"

const ScGridWrapper = styled.div`
  display: grid;
  width: 100%;

  ${({ contentSizes, column }) => {
    let renderSize = `repeat(${column || 1}, 1fr)`

    if (column !== 1 && contentSizes) {
      renderSize = contentSizes
    }
    renderSize = renderSize === "1fr" ? "minmax(0,1fr)" : renderSize
    return `grid-template-columns: ${renderSize};`
  }}

  grid-column-gap: ${(props) => props.columnGap};
  grid-row-gap: ${(props) => props.rowGap};
  // used for fit height with content
  height: max-content;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const GridList = (props) => (
  <ScGridWrapper
    className={props.className}
    columnGap={props.columnGap}
    rowGap={props.rowGap}
    column={props.column}
    contentSizes={props.contentSizes}
  >
    {props.children}
  </ScGridWrapper>
)

GridList.propTypes = {
  column: PropTypes.number,
  children: PropTypes.node,
  columnGap: PropTypes.string,
  rowGap: PropTypes.string,
  contentSizes: PropTypes.string,
  className: PropTypes.string,
}

GridList.defaultProps = {
  column: 1,
  children: null,
  columnGap: "1rem",
  rowGap: "2.5rem",
  contentSizes: null,
  className: "",
}

export default GridList
