import React from 'react'
import styled, { css } from 'styled-components'
import MuiIconButton from '@material-ui/core/IconButton'

export const ScIconImg = styled.img`
  height: ${props => (props.height ? props.height : 14)}px;
`
// Add more styled into Material-ui's button
export const ScIconButton = styled(({ isDisabled, ...restProps }) => (
  <MuiIconButton {...restProps} />
))`
  && {
    padding: 7px;
  }
`

const defaultNavbarTransitionStyle = css`
  ${({ styleState }) => {
    const isExited = styleState === 'exited'

    return `
      opacity: ${isExited ? 0 : 1};
      visibility: ${isExited ? 'hidden' : 'visible'};
    `
  }}
`
export const searchBarTransitionStyle = css`
  // visibility and opacity are defined inside defaultNavbarTransitionStyle
  transition: transform 0.3s, visibility 0.3s, opacity 0.3s;
  -webkit-transition: -webkit-transform 0.3s, opacity 0.3s, visibility 0.3s;

  ${defaultNavbarTransitionStyle}

  ${({ styleState }) => {
    let translateX = styleState === 'exited' ? '100%' : '0%'

    return `
      transform: translateX(${translateX});
      -webkit-transform: translateX(${translateX});
    `
  }}
`
export const menuBarTransitionStyle = css`
  // visibility and opacity are defined inside defaultNavbarTransitionStyle
  transition: visibility 0.3s, opacity 0.3s;
  -webkit-transition: visibility 0.3s, opacity 0.3s;

  ${defaultNavbarTransitionStyle}
`
