import React from 'react'
import styled from 'styled-components'
import { ShareButton } from '../button/ShareButton'
import { facebookShare } from 'wsc/utils/socialShare'
import PropTypes from 'prop-types'

const ScWrapper = styled.div`
  text-align: center;
  line-height: 0;
`

const ScButtonTextTitle = styled.span`
  display: inline-block;
  margin: 1.5px 10px 0;
  vertical-align: top;
  font-size: 1rem;
  font-weight: 700;
`

const ScButtonTextSubTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.7px;
  vertical-align: middle;
  margin: 0 20px;
  text-transform: uppercase;
`

const ScButtonTextSeparateLine = styled.span`
  /* fake vertical line */
  font-weight: 300;
  margin: 0;
  font-size: 1rem;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const ShareThisPost = props => {
  // share button - onclick handler
  const onClickShareButton = () => facebookShare(props.url)

  return (
    <ScWrapper>
      <ShareButton onClick={onClickShareButton}>
        <ScButtonTextTitle>f</ScButtonTextTitle>
        <ScButtonTextSeparateLine>|</ScButtonTextSeparateLine>
        <ScButtonTextSubTitle>SHARE</ScButtonTextSubTitle>
      </ShareButton>
    </ScWrapper>
  )
}

ShareThisPost.propTypes = {
  url: PropTypes.string.isRequired,
}

export default ShareThisPost
