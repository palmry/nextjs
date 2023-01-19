import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { useRouter } from 'next/router'
import { COLORS } from '../utils/styles'
import { getConfig } from '../globalConfig'

const { DEVICE_MINWIDTH } = getConfig('StyleConfig')

const withNoneLinkStyle = css`
  color: inherit;
  cursor: pointer;
  text-decoration: none;
`

const defaultLinkStyle = `
  color: var(--defaultLinkStyle_Color, ${COLORS.BLACK});
  cursor: pointer;
  text-decoration: none;
  border-bottom: 0.125rem solid var(--defaultLinkStyle_BorderBottomColor, ${
    COLORS.BLACK
  });

  ${
    withNoneLinkStyle &&
    `&:active {
      color: var(--defaultLinkStyle_HoverColor);
      svg {
        fill: var(--defaultLinkStyle_HoverColor);
      }
    }

    @media (min-width: ${DEVICE_MINWIDTH.DESKTOP}px) {
      &:hover {
        color: var(--defaultLinkStyle_HoverColor);
        svg {
          fill: var(--defaultLinkStyle_HoverColor);
        }
      }
    }`
  }

  /* set transparent background on pressed */
  /* http://samcroft.co.uk/2012/alternative-to-webkit-tap-highlight-color-in-phonegap-apps/ */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
`

// Default Link Style in CSS Tagged Template Literals
const withDefaultLinkStyle = css`
  ${defaultLinkStyle}
`

// Default Link Style in Normal CSS String
export const defaultLinkStyleToUseInMD = `
  a {
    ${defaultLinkStyle}
  }
`

const DefaultStyledLink = styled.a`
  ${withDefaultLinkStyle}
`

const NoneStyledLink = styled.a`
  ${withNoneLinkStyle}
  border: none;
`

const DefaultStyledExternalLink = styled.a`
  ${withDefaultLinkStyle}
  ${(props) => props.noneBorder && `border: none;`}
`

const NoneStyledExternalLink = styled.a`
  ${withNoneLinkStyle}
  ${(props) => props.noneBorder && `border: none;`}
`

const DefaultStyledDivLink = styled.div`
  ${withDefaultLinkStyle}
  ${(props) => props.noneBorder && `border: none;`}
`

const NoneStyledDivLink = styled.div`
  ${withNoneLinkStyle}
  ${(props) => props.noneBorder && `border: none;`}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const Link = ({
  to,
  children,
  className,
  isOpenNewTab,
  onClick,
  withDefaultStyle,
  noneBorder,
  prefetch = false,
  replace = false,
  shallow = false,
  ...restProps
}) => {
  const linkProps = { className, onClick }
  const router = useRouter()

  useEffect(() => {
    if (prefetch) {
      router.prefetch(to)
    }
  }, [router, to, prefetch])

  // Div Link (this type of link works with onclick function, prop `to` is useless)
  if (to === '/#')
    return withDefaultStyle ? (
      <DefaultStyledDivLink {...linkProps} {...restProps}>
        {children}
      </DefaultStyledDivLink>
    ) : (
      <NoneStyledDivLink {...linkProps} {...restProps}>
        {children}
      </NoneStyledDivLink>
    )

  const isInternalLink = to.charAt(0) === '/'

  // Check if it is external link and isOpenNewTab is set and not contain 'mailto:' at the beginning
  let openNewTabProp =
    !isInternalLink && isOpenNewTab && to.indexOf('mailto:') !== 0
      ? { target: '_blank', rel: 'noopener' }
      : {}

  // Internal Link
  if (isInternalLink && withDefaultStyle) {
    return (
      <DefaultStyledLink
        href={to}
        onClick={(event) => {
          event.preventDefault()
          if (replace) {
            router.replace(to, undefined, { shallow })
          } else {
            router.push(to, undefined, { shallow })
          }
        }}
        {...restProps}
      >
        {children}
      </DefaultStyledLink>
    )
  } else if (isInternalLink && !withDefaultStyle) {
    return (
      <NoneStyledLink
        href={to}
        onClick={(event) => {
          event.preventDefault()
          if (replace) {
            router.replace(to, undefined, { shallow })
          } else {
            router.push(to, undefined, { shallow })
          }
        }}
        {...restProps}
      >
        {children}
      </NoneStyledLink>
    )
  }
  // External Link
  else if (!isInternalLink && withDefaultStyle) {
    return (
      <DefaultStyledExternalLink
        href={to}
        {...linkProps}
        {...restProps}
        {...openNewTabProp}
      >
        {children}
      </DefaultStyledExternalLink>
    )
  } else {
    return (
      <NoneStyledExternalLink
        href={to}
        {...linkProps}
        {...restProps}
        {...openNewTabProp}
      >
        {children}
      </NoneStyledExternalLink>
    )
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  isOpenNewTab: PropTypes.bool, // only work for external link type
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  withDefaultStyle: PropTypes.bool,
  noneBorder: PropTypes.bool, // only work for external link type is not used default border-bottom : color yellow
}

Link.defaultProps = {
  isOpenNewTab: true,
  children: null,
  className: '',
  onClick: () => {},
  withDefaultStyle: true,
  noneBorder: false,
}

export default Link
