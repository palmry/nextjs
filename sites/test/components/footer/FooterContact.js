import React from "react"
import styled from "styled-components"
import { MEDIA, COLORS } from "../../utils/styles"
import Link from "wsc/components/Link"
import has from "lodash/has"

const ScContactDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  order: 1;
  justify-content: center;
  margin-bottom: 30px;

  ${MEDIA.MOBILE`
    width: 75%;
    margin-bottom: 24px;
  `}

  ${MEDIA.TABLET`
    margin-bottom: 24px;
  `}

  ${MEDIA.DESKTOP`
    justify-content: left;
    margin-bottom: 12px;
  `}
`
const ScLink = styled(Link)`
  font-weight: bold;
  text-transform: uppercase;
  line-height: 1.25rem;

  margin: 0 11.5px;

  ${MEDIA.DESKTOP`
    line-height: 0.94rem;
    text-align: left;
    margin-left: 0;
    margin-bottom: 0px;
    &:not(:last-child) {
      margin-right: 23px;
    }
    &:hover {
      color: ${COLORS.LT_SUN_YELLOW};
    }
  `}

  border: none;
  color: ${COLORS.WHITE};

  &:active {
    color: ${COLORS.LT_DARK_SUN_YELLOW};
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const FooterContact = () => {
  const CONTACT_LIST = [
    {
      label: "About",
      url: "/about",
    },
    {
      label: "Terms",
      url: "https://wildskymedia.com/terms-of-service/",
    },
    {
      label: "Contact",
      url: "/contact",
    },
    {
      label: "Privacy",
      url: "https://wildskymedia.com/privacy-policy/",
    },
    {
      label: "PRIVACY SETTINGS",
      url: "/#",
      onClick: () => {
        window.Optanon.ToggleInfoDisplay()
      },
    },
    {
      label: "SUBMIT A STORY",
      url: "/contact",
    },
  ]
  const contactLink = CONTACT_LIST.reduce((result, contact) => {
    const linkParams = { to: contact.url, key: contact.label }
    if (has(contact, "onClick")) {
      linkParams["onClick"] = contact.onClick
    }
    result.push(<ScLink {...linkParams}>{contact.label}</ScLink>)
    return result
  }, [])

  return <ScContactDiv>{contactLink}</ScContactDiv>
}

FooterContact.propTypes = {}

FooterContact.defaultProps = {}

export default FooterContact
