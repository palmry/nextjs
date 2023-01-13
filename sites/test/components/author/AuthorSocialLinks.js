import isEmpty from 'lodash/isEmpty'
import every from 'lodash/every'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SocialButton from 'wsc/components/button/SocialButton'
import { useTranslator } from '../../hooks/useTranslator'
import { COLORS, MEDIA } from '../../utils/styles'

const ScSocialLinkContainer = styled.div`
  color: ${COLORS.BLACK};
  margin-top: 20px;
  font-size: 0.75rem;
  ${MEDIA.DESKTOP`font-size: 0.69rem;`}
`

const ScSocialButtonContainer = styled.div`
  margin-top: 8px;
`

const ScSocialButton = styled(SocialButton)`
  &:not(:first-child) {
    margin-left: 8px;
  }
`

// Contenful key mapping
const SOCIAL_MENU_CONFIGS = [
  {
    label: 'InstagramCircle',
    contentfulKey: 'instagramUrl',
  },
  {
    label: 'FacebookCircle',
    contentfulKey: 'facebookUrl',
  },
  {
    label: 'TwitterCircle',
    contentfulKey: 'twitterUrl',
  },
  {
    label: 'PinterestCircle',
    contentfulKey: 'pinterestUrl',
  },
  {
    label: 'EmailCircle',
    contentfulKey: 'email',
  },
]

export function hasSocialLink(author) {
  let result = false
  for (const menu of SOCIAL_MENU_CONFIGS) {
    if (!isEmpty(author[menu.contentfulKey])) {
      result = true
      break
    }
  }
  return result
}

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AuthorSocialLinks = ({ author }) => {
  const { translator } = useTranslator()
  const socialButtons = SOCIAL_MENU_CONFIGS.map(
    menu =>
      !isEmpty(author[menu.contentfulKey]) && (
        <ScSocialButton
          type={menu.label}
          redirectUrl={
            menu.contentfulKey === 'email'
              ? 'mailto:' + author[menu.contentfulKey]
              : author[menu.contentfulKey]
          }
          key={menu.label}
        />
      )
  )
  // hide 'Follow Me' section if every SocialButton are empty
  return every(socialButtons, button => isEmpty(button)) ? null : (
    <ScSocialLinkContainer>
      {translator('author.followMe')}
      <ScSocialButtonContainer>{socialButtons}</ScSocialButtonContainer>
    </ScSocialLinkContainer>
  )
}

AuthorSocialLinks.propTypes = {
  author: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
  }).isRequired,
}

export default AuthorSocialLinks
