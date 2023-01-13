import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const ScList = styled.li`
  display: flex;
  margin: 0;
  font-weight: ${props => props.textWeight};
  list-style-type: none;

  ::before {
    content: '';
    flex: 0 0 auto;
    display: inline-block;
    width: 1.1em;
    margin-right: 0.3em;
    margin-top: 0.15em;
  }
`

const FancyBullet = ({ children, className, textWeight }) => {
  return (
    <ScList className={className} textWeight={textWeight}>
      {children}
    </ScList>
  )
}

FancyBullet.propTypes = {
  children: PropTypes.string.isRequired,
  textWeight: PropTypes.number.isRequired,
  className: PropTypes.string,
}

FancyBullet.defaultProps = {
  className: '',
}

export default FancyBullet
