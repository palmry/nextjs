import isEmpty from 'lodash/isEmpty'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FancyTitle from './FancyTitle'
import FancyBullet from './FancyBullet'
import { MEDIA } from '../../utils/styles'

const ScTitle = styled(FancyTitle)`
  margin-bottom: 18px;
  ${MEDIA.TABLET`margin-bottom: 15px;`}
  ${MEDIA.DESKTOP`margin-bottom: 15px;`}
`

const ScBullet = styled(FancyBullet)`
  margin-bottom: 9px;
  ${MEDIA.TABLET`margin-bottom: 7px;`}
  ${MEDIA.DESKTOP`margin-bottom: 7px;`}

  &:last-child {
    /* remove margin bottom of last element */
    margin-bottom: 0;
  }
`

const FancyList = props => {
  const { sumTitle, topics, textWeight } = props

  if (isEmpty(sumTitle) || isEmpty(topics)) {
    return null
  }

  return (
    <React.Fragment>
      <ScTitle title={sumTitle.toUpperCase()} />
      <ul>
        {topics.map(topic => (
          <ScBullet key={topic} textWeight={textWeight}>
            {topic}
          </ScBullet>
        ))}
      </ul>
    </React.Fragment>
  )
}

FancyList.propTypes = {
  sumTitle: PropTypes.string,
  topics: PropTypes.arrayOf(PropTypes.string),
  textWeight: PropTypes.number,
}

FancyList.defaultProps = {
  sumTitle: null,
  topics: null,
  textWeight: 400,
}

export default FancyList
