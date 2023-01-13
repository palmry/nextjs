import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Link from 'wsc/components/Link'
import routes from '../../configs/routes'

const ScTagsList = styled.div`
  margin: 0;
  text-align: center;
`

const ScTagItemInlineBlock = styled.span`
  display: inline-block;
  margin: 0 10px 20px 0;
`

const ScTagItemLink = styled(Link).attrs({
  className: 'font-description',
})`
  display: inline;
  text-transform: uppercase;
`

const RelatedTags = ({ tags }) => {
  return (
    <ScTagsList>
      {tags.map((tag, index) => {
        return (
          <ScTagItemInlineBlock key={`tag-${tag}-${index}`}>
            <ScTagItemLink to={routes.tag.pathResolver(tag)}>{tag}</ScTagItemLink>
          </ScTagItemInlineBlock>
        )
      })}
    </ScTagsList>
  )
}

RelatedTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
}

RelatedTags.defaultProps = {
  tags: [],
}

export default RelatedTags
