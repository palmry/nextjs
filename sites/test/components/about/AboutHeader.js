import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import FancyHeader from '../FancyHeader'
import ResponsiveImage from '../ResponsiveImage'
import ContentMarkdown from 'wsc/components/post/ContentMarkdown'
import PortionLayout from '../PortionLayout'
import { useTranslator } from '../../hooks/useTranslator'
import { MEDIA, FONT_FAMILIES, COLORS } from '../../utils/styles'

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin: 0 5.75rem;`}
`

const ScImageBox = styled.div`
  text-align: center;
`

const ScImageCredit = styled.div.attrs({
  className: 'font-description',
})`
  color: ${COLORS.GREY};
  text-align: center;
  padding-top: 0.31rem;
  letter-spacing: 0.05rem;
  ${MEDIA.TABLET`
    padding-top: 0.38rem;
  `}

  ${MEDIA.DESKTOP`
    padding-top: 0.44rem;
    letter-spacing: 0.04rem;
  `}
`

const ScOurMissionSection = styled.div`
  align-self: center;
  text-align: center;
`
const ScOurMissionContent = styled.div`
  font-family: ${FONT_FAMILIES.ASAP};
  font-style: italic;
  padding-top: 1.25rem;
  text-align: center;
  font-size: 1.44rem;
  line-height: 1.3;

  ${MEDIA.DESKTOP`
    font-size: 1.88rem;
    padding-top: 1rem;
  `}
`

const ScOurStorySection = styled.div`
  margin-top: 2.5rem;
  ${MEDIA.MOBILE`margin-top: 0;`}
`
const ScOurStoryTitle = styled(FancyHeader)`
  text-align: center;
`
const ScOurStoryContent = styled.div`
  ${MEDIA.MOBILE`text-align: center;`}
  padding-top: 1.25rem;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AboutHeader = ({ imageUrl, imageCredit, ourMission, ourStory }) => {
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)
  const { translator } = useTranslator()

  const aboutImage = (
    <ScImageBox>
      <ResponsiveImage title={'imageTitle'} src={imageUrl} fixedWidth={isMobile ? '220px' : null} />
      <ScImageCredit>Credit: {imageCredit}</ScImageCredit>
    </ScImageBox>
  )

  const aboutMission = (
    <ScOurMissionSection>
      <FancyHeader
        title={translator('aboutPage.ourMission')}
        withCenterLayout={false}
        withUnderline={true}
        underlineColor={COLORS.LT_HOSPITAL_GREEN}
      />

      <ScOurMissionContent>
        <ContentMarkdown content={ourMission} />
      </ScOurMissionContent>
    </ScOurMissionSection>
  )

  return (
    <ScWrapper>
      <PortionLayout
        mainSection={aboutImage}
        subSection={aboutMission}
        columnGap="16px"
        rowGap={isMobile ? '30px' : '0px'}
        mainSectionSize={isDesktop ? '444px' : '296px'}
        isColumnDirection={isMobile}
      />

      <ScOurStorySection>
        <ScOurStoryTitle
          title={translator('aboutPage.ourStory')}
          withUnderline={true}
          withCenterLayout={false}
        />
        <ScOurStoryContent>
          <ContentMarkdown content={ourStory} />
        </ScOurStoryContent>
      </ScOurStorySection>
    </ScWrapper>
  )
}

AboutHeader.propTypes = {
  imageUrl: PropTypes.any.isRequired,
  imageCredit: PropTypes.string.isRequired,
  ourMission: PropTypes.string.isRequired,
  ourStory: PropTypes.string.isRequired,
}

AboutHeader.defaultProps = {}

export default AboutHeader
