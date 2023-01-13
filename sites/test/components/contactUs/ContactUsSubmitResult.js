import React from "react"
import styled from "styled-components"
import { MEDIA, FONT_FAMILIES } from "../../utils/styles"
import Layout from "../Layout"
import DocumentHead from "../DocumentHead"

const ScThankyouHeader = styled.h2`
  font-family: ${FONT_FAMILIES.POPPINS};
  text-align: center;
  margin-bottom: 10px;
  ${MEDIA.TABLET` margin-bottom: 9px;`}
  ${MEDIA.DESKTOP` margin-bottom: 11px;`}
`

const ScThankyouContent = styled.p`
  font-family: ${FONT_FAMILIES.POPPINS};
  text-align: center;
`

const ScFlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 140px auto;

  ${MEDIA.MOBILE`
    margin-top: 100px;
    margin-bottom: 130px;
  `}

  ${MEDIA.DESKTOP`
    width: 720px;
    align-items: stretch;
  `}
`

const ContactUsSubmitResult = () => {
  return (
    <Layout contentDisplayStyle={"flex"} contentItemAlignment={"center"}>
      <DocumentHead title="Contact Us" />
      <ScFlexWrapper className="noskimlinks">
        <ScThankyouHeader>Thanks for reaching out! </ScThankyouHeader>
        <ScThankyouContent>
          Your message has been successfully submitted. We’ll review your email
          and get back to you shortly.
        </ScThankyouContent>
      </ScFlexWrapper>
    </Layout>
  )
}

export default ContactUsSubmitResult
