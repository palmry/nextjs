import React from 'react'
import styled, { css } from 'styled-components'
import { getConfig } from '../../globalConfig'
import { rgba } from '../../styleUtils'
import RightArrow from '../../statics/images/icon-nav-right.svg'

const { COLORS } = getConfig('StyleConfig')

const withCircleIcon = css`
  background-color: ${rgba(COLORS.WHITE, '0.3')};
  height: 28px;
  width: 28px;
  display: block;
  border-radius: 100%;
  fill: ${COLORS.WHITE};
  padding: 6px;
  box-sizing: border-box;
  cursor: pointer;
`

export const ScCircleArrowRight = styled((props) => <RightArrow {...props} />)`
  ${withCircleIcon};
`

export const ScCircleArrowLeft = styled((props) => <RightArrow {...props} />)`
  ${withCircleIcon};
  transform: rotate(180deg);
`
