import isEmpty from 'lodash/isEmpty'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { redirect, getWindowOption } from '../../utils/redirect'
import { getConfig } from '../../globalConfig'

import IconInstagram from '../../statics/images/icon-instagram.svg'
import IconInstagramCircle from '../../statics/images/icon-instagram-circle.svg'
import IconInstagramBlue from '../../statics/images/icon-instagram-follow-us.svg'
import IconFacebook from '../../statics/images/icon-facebook.svg'
import IconFacebookCircle from '../../statics/images/icon-facebook-circle.svg'
import IconFacebookBlue from '../../statics/images/icon-facebook-follow-us.svg'
import IconTwitter from '../../statics/images/icon-twitter.svg'
import IconTwitterCircle from '../../statics/images/icon-twitter-circle.svg'
import IconTwitterBlue from '../../statics/images/icon-twitter-follow-us.svg'
import IconPinterest from '../../statics/images/icon-pinterest.svg'
import IconPinterestCircle from '../../statics/images/icon-pinterest-circle.svg'
import IconPinterestBlue from '../../statics/images/icon-pinterest-follow-us.svg'
import IconYoutube from '../../statics/images/icon-youtube.svg'
import IconYoutubeBlue from '../../statics/images/icon-youtube-follow-us.svg'
import IconSnapChat from '../../statics/images/icon-snapchat.svg'
import IconSnapChatBlue from '../../statics/images/icon-snapchat-follow-us.svg'
import IconEmailCircle from '../../statics/images/icon-email-circle.svg'

const { COLORS } = getConfig('StyleConfig')
const styledSVGCircle = (SVGComponent) => {
  return styled(({ height, ...restProps }) => <SVGComponent {...restProps} />)`
    height: ${(props) => props.height};
    fill: var(--socialButton_CircleColor, ${COLORS.LIGHT_BLUE});
    &:hover {
      fill: var(--socialButton_CircleHoverColor, ${COLORS.WARM_YELLOW});
    }
    &:active {
      fill: var(--socialButton_CircleActiveColor, ${COLORS.BROWN});
    }
  `
}

// Icons in the footer of every page
const styledSVGNoBG = (SVGComponent) => {
  return styled(({ height, ...restProps }) => <SVGComponent {...restProps} />)`
    height: ${(props) => props.height};
    fill: var(--socialButton_NoBgColor, ${COLORS.WHITE});
    &:hover {
      fill: var(--socialButton_NoBgHoverColor, ${COLORS.WARM_YELLOW});
    }
    &:active {
      fill: var(--socialButton_NoBgActiveColor, ${COLORS.BROWN});
    }
  `
}

const SocialIcons = {
  Instagram: styledSVGNoBG(IconInstagram),
  InstagramCircle: styledSVGCircle(IconInstagramCircle),
  InstagramBlue: IconInstagramBlue,
  Facebook: styledSVGNoBG(IconFacebook),
  FacebookCircle: styledSVGCircle(IconFacebookCircle),
  FacebookBlue: IconFacebookBlue,
  Twitter: styledSVGNoBG(IconTwitter),
  TwitterCircle: styledSVGCircle(IconTwitterCircle),
  TwitterBlue: IconTwitterBlue,
  Pinterest: styledSVGNoBG(IconPinterest),
  PinterestCircle: styledSVGCircle(IconPinterestCircle),
  PinterestBlue: IconPinterestBlue,
  Youtube: styledSVGNoBG(IconYoutube),
  YoutubeBlue: IconYoutubeBlue,
  EmailCircle: styledSVGCircle(IconEmailCircle),
  SnapChat: styledSVGNoBG(IconSnapChat),
  SnapChatBlue: IconSnapChatBlue,
}

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SocialButton = ({
  type,
  redirectUrl,
  withNewWindow,
  height,
  className,
}) => {
  const onClickSocialButton = (e) => {
    e.preventDefault()
    redirect(redirectUrl, getWindowOption())
  }
  const IconComponent = !isEmpty(SocialIcons[type]) && SocialIcons[type]
  return (
    <a
      className={className}
      size='small'
      aria-label={type}
      href={redirectUrl}
      onClick={withNewWindow ? onClickSocialButton : null}
      /* See detail why we disable this at MOMCOM-678 */
      /* eslint-disable-next-line react/jsx-no-target-blank */
      target='_blank'
      rel='noopener'
    >
      {<IconComponent height={height} />}
    </a>
  )
}

SocialButton.propTypes = {
  type: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string.isRequired,
  withNewWindow: PropTypes.bool,
  height: PropTypes.string,
  className: PropTypes.string,
}

SocialButton.defaultProps = {
  withNewWindow: false,
  height: '1.875rem',
  className: '',
}

export default SocialButton
