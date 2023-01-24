import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useRouter } from 'next/router'

export const NoneStyledLink = styled.a`
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  border: none;
`
const ScExternalLink = styled.a``
/*---------------------------------------------------------------------------------
 *  RENDER PHASE
 *--------------------------------------------------------------------------------*/

const LinkImage = ({
  to,
  children,
  className,
  isOpenNewTab,
  onClick,
  withDefaultStyle,
  prefetch = false,
  replace = false,
  shallow = false,
  ...restProps
}) => {
  const isInternalLink = to.charAt(0) === '/'
  const linkProps = { className, onClick }
  const router = useRouter()

  useEffect(() => {
    if (prefetch) {
      router.prefetch(to)
    }
  }, [router, to, prefetch])

  // Check if it is external link and isOpenNewTab is set and not contain 'mailto:' at the beginning
  let openNewTabProp =
    !isInternalLink && isOpenNewTab && to.indexOf('mailto:') !== 0
      ? { target: '_blank', rel: 'noopener' }
      : {}

  // </RenderComponent>
  return (
    <React.Fragment>
      {isInternalLink ? (
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
          {...linkProps}
          {...restProps}
        >
          {children}
        </NoneStyledLink>
      ) : (
        <ScExternalLink
          href={to}
          {...linkProps}
          {...restProps}
          {...openNewTabProp}
        >
          {children}
        </ScExternalLink>
      )}
    </React.Fragment>
  )
}

LinkImage.propTypes = {
  to: PropTypes.string,
  isOpenNewTab: PropTypes.bool, // only work for external link type
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  withDefaultStyle: PropTypes.bool,
}

LinkImage.defaultProps = {
  to: '',
  isOpenNewTab: true,
  children: null,
  className: '',
  onClick: () => {},
  withDefaultStyle: true,
}

export default LinkImage
