import React, { useState } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import styled, { css } from 'styled-components'
import isNull from 'lodash/isNull'

import { useTranslator } from '../../hooks/useTranslator'

import Link from 'wsc/components/Link'
import { NAVIGATION_BAR_HEIGHT, COLORS, FONT_FAMILIES } from '../../utils/styles'
import GREEN_TRIANGLE from '../../statics/images/triangle-up.svg'
import { ReactComponent as IconNavUp } from '../../statics/images/icon-nav-up.svg'

/** -------------------------------------------
 * STYLED
 ----------------------------------------------*/
const ScMainItem = styled.li`
  list-style-type: none;
  position: relative;
  text-transform: uppercase;
`
const wrapperMainStyle = css`
  font-family: ${FONT_FAMILIES.ASAP};
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: ${NAVIGATION_BAR_HEIGHT}px;
  text-decoration: none;
  border: none;
  font-weight: bold;
  ${props =>
    props.isActive &&
    `
    color: ${COLORS.BLACK};
    background-color: ${COLORS.LT_SUN_YELLOW};
  `}
`
const ScFlexWrapperMainLink = styled(({ isActive, ...restProps }) => <Link {...restProps} />).attrs(
  {
    className: 'font-description',
  }
)`
  ${wrapperMainStyle}
`
const ScFlexWrapperMainNonLink = styled.div.attrs({
  className: 'font-description',
})`
  ${wrapperMainStyle}
`
const ScIconNavUp = styled(({ isActive, ...restProps }) => <IconNavUp {...restProps} />)`
  margin-left: 5px;
  width: 7px;
  fill: black;
  transform: rotateX(180deg);
  ${props =>
    props.isActive &&
    `
    transform: none;
  `}
`
const ScAbsoluteTriangle = styled.img`
  position: absolute;
  bottom: 0;
  left: calc(50% - 10px);
  width: 20px;
  ${props => !props.isActive && 'display: none;'}
`
const ScAbsoluteWrapper = styled.ul`
  background-color: ${COLORS.LT_DARK_GREY_BLUE};
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.16);
  position: absolute;
  top: ${NAVIGATION_BAR_HEIGHT}px;
  white-space: nowrap;
  ${props => {
    return `
      display: ${props.isActive ? 'block' : 'none'};
      ${props.isLeftAlign ? 'left: 0;' : 'right: 0;'}
    `
  }}
`
const ScSubItem = styled.li`
  list-style-type: none;
`
const ScSubLink = styled(({ isFirstItem, isLastItem, ...restProps }) => (
  <Link {...restProps} />
)).attrs({
  className: 'font-description',
})`
  display: block;
  padding: 5px 20px;
  border: none;
  text-decoration: none;
  font-weight: bold;
  color: ${COLORS.WHITE};
  ${props => props.isFirstItem && 'padding-top: 20px;'}
  ${props => props.isLastItem && 'padding-bottom: 20px;'}
  &:hover {
    color: ${COLORS.LT_LIGHT_GRAY};
    text-decoration: underline;
  }
`

/** -------------------------------------------------------
 * SUB-COMPONENT(s)
 ---------------------------------------------------------- */
const MenuItem = props => {
  const [isActive, setIsActive] = useState(false)
  const RenderComponent = isNull(props.titleURL) ? ScFlexWrapperMainNonLink : ScFlexWrapperMainLink
  return (
    <ScMainItem onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
      <RenderComponent to={props.titleURL} isActive={isActive} withDefaultStyle={false}>
        {props.title}
        {!isEmpty(props.subNavigationItems) && (
          <React.Fragment>
            <ScIconNavUp isActive={isActive} />
            <ScAbsoluteTriangle src={GREEN_TRIANGLE} alt="" isActive={isActive} />
          </React.Fragment>
        )}
      </RenderComponent>
      {!isEmpty(props.subNavigationItems) && (
        <ScAbsoluteWrapper isActive={isActive} isLeftAlign={props.isLeftAlign}>
          {props.subNavigationItems.map((subCat, index) => (
            <ScSubItem key={subCat.title}>
              <ScSubLink
                to={subCat.url}
                isFirstItem={index === 0}
                isLastItem={index === props.subNavigationItems.length - 1}
              >
                {subCat.title}
              </ScSubLink>
            </ScSubItem>
          ))}
        </ScAbsoluteWrapper>
      )}
    </ScMainItem>
  )
}

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  titleURL: PropTypes.string,
  subNavigationItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    })
  ).isRequired,
  isLeftAlign: PropTypes.bool,
}

MenuItem.defaultProps = {
  isLeftAlign: true,
  titleURL: null,
}

/** ----------------------------------------------------
 * MAIN COMPONENT
 ------------------------------------------------------- */
const MenuDesktop = () => {
  const { getNavbarConfig } = useTranslator()

  // check item count for setting left align for first half menu
  const menuItemCount = getNavbarConfig().length ? getNavbarConfig().length : 8

  return getNavbarConfig().map((menu, index) => (
    <MenuItem
      key={menu.title}
      title={menu.title}
      titleURL={menu.url}
      subNavigationItems={menu.subNavigationItems}
      isLeftAlign={index >= menuItemCount / 2 ? false : true}
    />
  ))
}

export default MenuDesktop
