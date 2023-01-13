import styled from "styled-components"
import React, { useState } from "react"
import PropTypes from "prop-types"
import { COLORS, FONT_FAMILIES, MEDIA } from "../utils/styles"
import Select from "@material-ui/core/Select"
import Checkbox from "@material-ui/core/Checkbox"
import ListItemText from "@material-ui/core/ListItemText"
import Chip from "@material-ui/core/Chip"
import MenuItem from "@material-ui/core/MenuItem"
import MaterialUiStyle from "wsc/components/styled/MaterialUiStyle"

const ScFieldWrapper = styled.div`
  position: relative;
`

const ScSelect = styled(({ isError, isFocus, ...restProps }) => (
  <Select {...restProps} />
))`
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 0.94rem;
  ${MEDIA.MOBILE`font-size: 1rem`}
  padding: 0;
  width: 100%;
  border-radius: 4px;
  background-color: ${COLORS.WHITE};
  min-height: 44px;
  ${MEDIA.MOBILE` min-height: 46px;`}

  border: 1px solid
    ${(props) =>
    props.isFocus
      ? COLORS.LT_DARK_GREY_BLUE
      : props.isError === true
      ? COLORS.LT_DARK_ORANGE
      : props.isError === false
      ? COLORS.LT_LIGHT_BLUE
      : COLORS.LIGHT_GRAY};
`
const ScChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 2px 30px 2px 20px;
  ${(props) => props.height && ` min-height: ${props.height};`}
`
const ScChipItem = styled(Chip)`
  font-family: ${FONT_FAMILIES.POPPINS} !important;
  margin: 4px 8px 4px 0;

  height: 30px !important;
  font-size: 0.69rem !important;
  ${MEDIA.MOBILE`
    height: 32px !important;
    font-size: 0.75rem !important;
  `}

  & .MuiChip-label {
    padding-left: 8px;
    padding-right: 8px;
    letter-spacing: 0.06em;
  }
`
const ScPlaceHolder = styled.span`
  color: ${COLORS.GREY};
  pointer-events: none;
  line-height: 1.7;
  font-family: ${FONT_FAMILIES.POPPINS} !important;
  font-size: 0.94rem !important;
  ${MEDIA.MOBILE`
  font-size: 1rem !important;
`}
  ${(props) => props.margin && `margin: ${props.margin};`}
`
const ScItem = styled.div`
  display: flex;
  align-items: center;
  padding-left: 8px;
`
const ScListItemText = styled(ListItemText)`
  span {
    line-height: 1.7;
    font-family: ${FONT_FAMILIES.POPPINS} !important;
    font-size: 0.94rem !important;
    ${MEDIA.MOBILE`
      font-size: 1rem !important;
    `}
  }
`
const ScError = styled.div`
  margin-top: 4px;
  line-height: 1.7;
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 0.69rem;
  ${MEDIA.MOBILE`font-size: 0.75rem;`}
  ${(props) => props.color && `color: ${props.color};`}
`

const CheckBox = ({
  className,
  items,
  name,
  errMsg,
  errorTextColor,
  setFieldValue,
  onChangeFunction,
  height,
  MenuProps,
}) => {
  const [result, setResult] = useState([])
  const [isError, setIsError] = useState(undefined)
  const [isFocus, setIsFocus] = useState(undefined)

  const handleChange = (event) => {
    onChangeFunction(event)
    const { value } = event.target
    setResult(value)
    setFieldValue(name, value)
  }

  const handleOnOpen = () => {
    setFieldValue(name, result)
    setIsFocus(true)
  }

  const handleOnClose = () => {
    setIsError(errMsg ? true : false)
    setIsFocus(false)
  }

  const ITEM_HEIGHT = 48
  const DefaultMenuProps = {
    getContentAnchorEl: null,
    disableAutoFocusItem: true,
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 6,
        zIndex: 10003,
      },
    },
    MenuListProps: {
      disablePadding: true,
    },
  }

  return (
    <ScFieldWrapper className={className}>
      <MaterialUiStyle height={height} />
      <ScSelect
        multiple
        displayEmpty
        disableUnderline
        value={result}
        MenuProps={{ ...DefaultMenuProps, ...MenuProps }}
        onChange={handleChange}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <ScPlaceHolder margin={"0 0 0 20px"}>
                Check all that apply
              </ScPlaceHolder>
            )
          }
          return (
            <ScChipWrapper height={height}>
              {selected.map((value) => (
                <ScChipItem key={value} label={value} />
              ))}
            </ScChipWrapper>
          )
        }}
        onOpen={handleOnOpen}
        onClose={handleOnClose}
        isError={isError}
        isFocus={isFocus}
      >
        <MenuItem
          classes={{ root: "MuiMenuItem-root-forCheckBoxPlaceHolder" }}
          disabled
          value=""
        >
          <ScPlaceHolder margin={"0 0 0 20px"}>
            Check all that apply
          </ScPlaceHolder>
        </MenuItem>
        {items.map((item) => (
          <MenuItem
            classes={{ root: "MuiMenuItem-root-forCheckBox" }}
            key={item}
            value={item}
          >
            <ScItem>
              <Checkbox checked={result.indexOf(item) > -1} />
              <ScListItemText primary={item} />
            </ScItem>
          </MenuItem>
        ))}
      </ScSelect>

      {isError && <ScError color={errorTextColor}>{errMsg}</ScError>}
    </ScFieldWrapper>
  )
}

CheckBox.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  errMsg: PropTypes.string,
  errorTextColor: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
  onChangeFunction: PropTypes.func.isRequired,
  height: PropTypes.string,
  MenuProps: PropTypes.object,
}

CheckBox.defaultProps = {
  className: "",
  errMsg: null,
  errorTextColor: COLORS.LT_DARK_ORANGE,
  height: "42px",
  MenuProps: {},
}

export default CheckBox
