import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { useState, useContext, useEffect } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import isNull from 'lodash/isNull'

import Link from 'wsc/components/Link'
import MuiIconButton from '@material-ui/core/IconButton'
import Gridlist from '../GridList'

import { useTranslator } from '../../hooks/useTranslator'
import { ReactComponent as IconNavUp } from '../../statics/images/icon-nav-up.svg'
import { COLORS, MEDIA, PAGE_WIDTHS, withFullWidth, FONT_FAMILIES } from '../../utils/styles'
import { useFreezePage } from '../../hooks/useFreezePage'

const itemFlexWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${withFullWidth}
`
/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const ScWrapper = styled.div`
  overflow: scroll;
  position: absolute;
  top: 100%;
  left: 0;
  ${props => `height: calc(${props.viewHeight}px - 100%);`}
  width: 100vw;
  background: ${COLORS.LT_DARK_PEACH};

  // fading animation
  -webkit-transition: opacity 0.2s, visibility 0.2s;
  transition: opacity 0.2s, visibility 0.2s;
  visibility: hidden;
  opacity: 0;
  ${props =>
    props.isOpen &&
    `
      visibility: unset;
      opacity: 1;
  `}
`
const ScMenuItemFlexWrapper = styled.div`
  ${itemFlexWrapperStyle}
  ${props =>
    props.isExpanded
      ? `background: ${COLORS.LT_SUN_YELLOW}`
      : `border-bottom: 1px solid ${COLORS.LT_DARK_BROWN};`}
`
const ScMainMenuFlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 36px;
  width: 100%;

  ${MEDIA.TABLET`
    width: ${PAGE_WIDTHS.TABLET}px;
    padding: 12px 0;
  `}
`
const ScMainMenuItem = styled.div.attrs({
  className: 'font-h2',
})`
  && {
    color: ${COLORS.WHITE};
  }

  font-family: ${FONT_FAMILIES.POPPINS};
  text-transform: uppercase;
  // reserve spacing for long category title
  margin-right: 10px;

  // slide-in animation
  opacity: 0;
  transform: translate(100%);
  -webkit-transform: translate(100%);

  ${props =>
    props.slideAnimationTimeout &&
    `-webkit-transition: -webkit-transform 0.5s ${props.slideAnimationTimeout}, opacity 1s ${props.slideAnimationTimeout};
      transition: transform 0.5s ${props.slideAnimationTimeout}, opacity 1s ${props.slideAnimationTimeout};
    `}

  ${props =>
    props.animateSlideAnimation &&
    `
      transform: translate(0%);
      -webkit-transform: translate(0%);
      opacity: 1;
  `}
`
const ScIconNavUp = styled(({ isExpanded, ...restProps }) => <IconNavUp {...restProps} />)`
  fill: ${COLORS.WHITE};
  width: 11.2px;

  // rotate animation
  -webkit-transform: rotate(180deg);
  -webkit-transition: transform 0.4s;
  transform: rotate(180deg);
  transition: transform 0.4s;

  ${props =>
    props.isExpanded &&
    `
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
  `}
`
const ScSubMenuItemFlexWrapper = styled.div`
  && {
    position: unset;
  }

  background: ${COLORS.LT_AQUA_MARINE};
  ${itemFlexWrapperStyle};

  // expand animation
  // cannot use auto height with transition
  // ref: https://css-tricks.com/using-css-transitions-auto-dimensions/
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  -webkit-transition: max-height 0.5s, opacity 1s;
  transition: max-height 0.5s, opacity 1s;

  ${props =>
    props.isExpanded &&
    `
      opacity: 1;
      // make sure we must set height more than actual height
      max-height: 2000px;
    `}
`
const ScSubMenuFlexBox = styled(ScMainMenuFlexBox)`
  flex-direction: column;
  // 56px = ScMainMenuFlexBox padding left + 20px
  padding: 30px 0 30px 56px;

  && {
    ${MEDIA.TABLET`
    width: ${PAGE_WIDTHS.TABLET}px;
    padding-left: 20px;
  `}
  }
`
const ScSubMenuItem = styled.span.attrs({
  className: 'font-h4',
})`
  && {
    color: ${COLORS.WHITE};
  }

  &:active {
    color: ${COLORS.LT_VERY_LIGHT_GRAY};
  }

  font-family: ${FONT_FAMILIES.POPPINS};
  text-transform: uppercase;
`
const CategoryStyle = css`
  flex: 1;

  ${props =>
    props.isUnderlinedOnHover &&
    `
      &:active {
        text-decoration: underline;
        text-decoration-color: ${COLORS.LT_VERY_LIGHT_GRAY};
      }
    `}
`
const ScCategoryLink = styled(({ isUnderlinedOnHover, ...restProps }) => (
  <Link withDefaultStyle={false} noneBorder={true} {...restProps} />
))`
  ${CategoryStyle}
`
const ScCategoryNonLink = styled.div`
  ${CategoryStyle}
`
const IconButton = styled(MuiIconButton)`
  && {
    margin-left: 20px;
    padding: 8px;
  }
`

const ScInvisibleBlock = styled.div`
  height: 60px; /* footer ad is 50px height */
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

// second unit
const ANIMATION_SLIDEIN_TIME_GAP = 0.03

const MenuItem = props => {
  const { onClickMenuItem, menuConfig, setExpandedCategoryLink } = props
  const { isTablet } = useContext(DetectDeviceContext)
  const subNavItems = get(menuConfig, 'subNavigationItems', [])
  const isSubNavItemsExist = !isEmpty(subNavItems)

  // category item: onclick event
  const onClickCategoryItem = () => {
    onClickMenuItem()
    // reset all expanded item
    setExpandedCategoryLink(null)
  }

  let id = isNull(menuConfig.url) ? menuConfig.title : menuConfig.url

  // expand state
  const isExpanded = props.expandedCategoryLink === id
  // dropdown button: onclick event
  const onClickDropdownButton = () => {
    if (isExpanded) {
      // if it's expanded, we need to un-expand the current link
      setExpandedCategoryLink(null)
    } else {
      // if it's not expanded, we need to expand the current link (one at a time)
      setExpandedCategoryLink(id)
    }
  }

  const mainMenuItem = (
    <ScMainMenuItem
      animateSlideAnimation={props.animateSlideAnimation}
      slideAnimationTimeout={props.slideAnimationTimeout}
    >
      {menuConfig.title}
    </ScMainMenuItem>
  )

  return (
    <ScMenuItemFlexWrapper isExpanded={isExpanded}>
      <ScMainMenuFlexBox>
        {isNull(menuConfig.url) ? (
          <ScCategoryNonLink>{mainMenuItem}</ScCategoryNonLink>
        ) : (
          <ScCategoryLink to={menuConfig.url} onClick={onClickCategoryItem}>
            {mainMenuItem}
          </ScCategoryLink>
        )}
        {isSubNavItemsExist && (
          <IconButton onClick={onClickDropdownButton}>
            <ScIconNavUp isExpanded={isExpanded} />
          </IconButton>
        )}
      </ScMainMenuFlexBox>
      {isSubNavItemsExist && (
        <ScSubMenuItemFlexWrapper isExpanded={isExpanded}>
          <ScSubMenuFlexBox>
            <Gridlist column={isTablet ? 2 : 1} rowGap={'15px'}>
              {subNavItems.map(subItem => (
                <ScCategoryLink
                  key={`submenu-${subItem.title}`}
                  to={subItem.url}
                  onClick={onClickCategoryItem}
                  isUnderlinedOnHover={true}
                >
                  <ScSubMenuItem>{subItem.title}</ScSubMenuItem>
                </ScCategoryLink>
              ))}
            </Gridlist>
          </ScSubMenuFlexBox>
        </ScSubMenuItemFlexWrapper>
      )}
    </ScMenuItemFlexWrapper>
  )
}

MenuItem.propTypes = {
  onClickDropdownButton: PropTypes.func,
  onClickMenuItem: PropTypes.func,
  slideAnimationTimeout: PropTypes.string,
  animateSlideAnimation: PropTypes.bool,
  menuConfig: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    subNavigationItems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }),
  // state handler
  expandedCategoryLink: PropTypes.string,
  setExpandedCategoryLink: PropTypes.func,
}

MenuItem.defaultProps = {
  onClickDropdownButton: () => {},
  onClickMenuItem: () => {},
  slideAnimationTimeout: '0s',
  animateSlideAnimation: false,
  menuConfig: {},
  // state handler
  expandedCategoryLink: null,
  setExpandedCategoryLink: () => {},
}

const MenuMobile = ({ isOpen, onClickMenuItem }) => {
  // Freeze/Unfreeze scrolling
  useFreezePage(isOpen)

  // Expand/Collapse sub menus
  const [expandedCategoryLink, setExpandedCategoryLink] = useState(null)
  // Collapse all sub-nav when nav was closed
  useEffect(() => {
    if (!isOpen) {
      setExpandedCategoryLink(null)
    }
  }, [isOpen])

  // Adjust the component height according to screen orientation
  const [viewHeight, setViewHeight] = useState(window.innerHeight)
  useEffect(() => {
    const handleResize = () => {
      setViewHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const { getNavbarConfig } = useTranslator()

  return (
    <ScWrapper
      isOpen={isOpen}
      // Actual view height without mobile browser's interface e.g. address bar, back buttons
      viewHeight={viewHeight}
    >
      {getNavbarConfig().map((menu, index) => (
        <MenuItem
          key={`menu-${menu.title}`}
          menuConfig={menu}
          animateSlideAnimation={isOpen}
          slideAnimationTimeout={`${ANIMATION_SLIDEIN_TIME_GAP * index}s`}
          onClickMenuItem={onClickMenuItem}
          // expanded category link handler
          expandedCategoryLink={expandedCategoryLink}
          setExpandedCategoryLink={setExpandedCategoryLink}
        />
      ))}
      <ScInvisibleBlock /> {/* to avoid footer ad overlapping */}
    </ScWrapper>
  )
}

MenuMobile.propTypes = {
  onClickMenuItem: PropTypes.func,
  isOpen: PropTypes.bool,
}

MenuMobile.defaultProps = {
  onClickMenuItem: () => {},
  isOpen: false,
}

export default MenuMobile
