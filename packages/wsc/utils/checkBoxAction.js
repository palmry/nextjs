import React, { useState } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { MEDIA } from "../utils/styles"
import tick from "../statics/images/tick.svg"

const CheckBoxWrapper = styled.div`
  position: relative;
  font-size: 1rem;
  text-align: left;
  margin-top: 13px;
  line-height: 1.25;
`
const Text = styled.label`
  margin-left: 38px;
  font-size: 1rem;
  ${MEDIA.TABLET`font-size: 0.95rem;`}
`
const VirtualBox = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  float: left;
  width: 24px;
  height: 19px;
  color: white;
  text-align: center;
  background-color: #ffffff;
  border: solid 1px #d8d8d8;
  ${(props) =>
    props.marked &&
    `background-color: #0b4667;
    border: solid 1px #0b4667;`}
  -webkit-user-select: none; /* Disable hilighting Chrome all / Safari all */
  -moz-user-select: none; /* Disble hilighting Firefox all */
  -ms-user-select: none; /* Disable hilighting IE 10+ */
  user-select: none; /* Disable hilighting Likely future */
`
const CheckMark = styled.img`
  width: 16px;
  height: 16px;
  fill: white;
`
export const CheckBoxAction = ({ id, text, action, children }) => {
  const [check, setCheck] = useState(false)

  CheckBoxAction.propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }
  return (
    <CheckBoxWrapper name={id}>
      <VirtualBox
        marked={check}
        onClick={() => {
          setCheck(!check)
          action(!check)
        }}
      >
        {check && <CheckMark src={tick}></CheckMark>}
      </VirtualBox>
      {children}
      {text && <Text>{text}</Text>}
    </CheckBoxWrapper>
  )
}
