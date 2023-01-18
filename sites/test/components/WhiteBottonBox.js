import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from 'wsc/components/Link'
import { FONT_FAMILIES, COLORS, MEDIA } from '../utils/styles'
import right from '../statics/images/icon-nav-left.svg'

const ButtonWrapper = styled.div`
  ${MEDIA.MOBILE`
  width: 296px;
  height: 40px; `}
  ${MEDIA.TABLET`
  width: 296px;
  height: 40px; `}
  ${MEDIA.DESKTOP`
  width: 334px;
  height: 40px; `}
  margin: auto;
`
const Button = styled.div`
  line-height: 1;
  padding-top: 1px;
  color: white;
  border: 1px solid white;
  height: 40px;
  margin: auto;
  font-weight: 600;
  font-size: 0.94rem;
  font-family: ${FONT_FAMILIES.POPPINS};
  width: 296px;
  &:hover {
    border: none;
    background-color: ${COLORS.rgba(COLORS.WHITE, '0.3')};
  }

  &:active {
    border: none;
    background-color: ${COLORS.rgba(COLORS.WHITE, '0.7')};
  }

  ${MEDIA.MOBILE`
    width: 296px;
    height: 40px; `}
  ${MEDIA.TABLET`
    width: 296px;
    height: 40px; `}
  ${MEDIA.DESKTOP`
    width: 334px;
    height: 40px; `}

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
`
const TextWraper = styled.div`
  position: relative;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  text-transform: uppercase;
`

const IconNext = styled(right)`
  fill: ${COLORS.WHITE}
  width: 4.5px;
  height: 8.4px;
  margin-left: 6px;
`

const WhiteBottonBox = (props) => {
  return (
    <ButtonWrapper>
      <Link to={props.to} withDefaultStyle={false}>
        <Button>
          <TextWraper>
            {props.text}
            <IconNext />
          </TextWraper>
        </Button>
      </Link>
    </ButtonWrapper>
  )
}

WhiteBottonBox.propTypes = {
  to: PropTypes.string,
  text: PropTypes.string,
}

WhiteBottonBox.defaultProps = {
  to: null,
  text: '',
}

export default WhiteBottonBox
