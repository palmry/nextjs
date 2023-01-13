import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from 'wsc/components/Link'

const ScLink = styled(({ isHovering, ...props }) => <Link {...props} />)`
  color: inherit;
  font-weight: inherit;
  font-size: inherit;
  ${props => props.isHovering && `text-decoration: underline;`}
  ${props => props.noneBorder && `border-bottom: none;`}
`

const LinkHeading = props => {
  const { to, children, isHovering, onMouseOver, onMouseOut, noneBorder } = props
  return (
    <ScLink
      to={to}
      withDefaultStyle={false}
      isHovering={isHovering}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      noneBorder={noneBorder}
    >
      {children}
    </ScLink>
  )
}

LinkHeading.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isHovering: PropTypes.bool.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  noneBorder: PropTypes.bool, // only work for external link type is not used default border-bottom : color yellow
}

LinkHeading.defaultProps = {
  noneBorder: false,
}
export default LinkHeading
