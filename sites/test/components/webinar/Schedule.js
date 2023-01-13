import React, { useContext } from 'react'
import { defaultLinkStyleToUseInMD } from 'wsc/components/Link'
import ICON_AUTHOR_PLACEHOLDER from '../../statics/images/icon-author-placeholder.png'
import marked from 'marked'
import { markedLink } from 'wsc/utils/redirect'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { COLORS, MEDIA } from '../../utils/styles'
import ResponsiveImage from '../ResponsiveImage'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

const ScWrapper = styled.div`
  margin-top: 10px;
`
const ScItem = styled.div`
  display: flex;
`
const ScImageFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
`
const ScBoxShadow = styled.div`
  height: 76px;
  box-shadow: 0 4px 10px 0 rgba(235, 30, 79, 0.3);
  border-radius: 50%;
`
const ScVerticalLine = styled.div`
  border-left: 1px solid ${COLORS.LT_WEBINAR_DARK_GREEN};
  margin: 12px 0;
  height: 100%;
`
const ScDescriptionFlex = styled.div`
  display: flex;
  flex-direction: column;
  color: ${COLORS.LT_WEBINAR_DARK_GREEN};
  width: 100%;

  ${MEDIA.DESKTOP`
    width: 628px;
  `}
  ${MEDIA.TABLET`
    width: 514px;
  `}
`
const ScTimeSlot = styled.p`
  font-size: 0.75rem
  line-height: 1.67;

  ${MEDIA.DESKTOP` 
    font-size: 0.68rem;
    line-height: 1.73;
  `}
`
const ScDescription = styled.div`
  ${defaultLinkStyleToUseInMD}
  font-size: 0.93rem
  line-height: 1.73;

  ${MEDIA.MOBILE`
    font-size: 1rem;
    line-height: 1.69;
  `}

  ${props =>
    props.paddingBottom &&
    `
    padding-bottom: ${props.paddingBottom};
  `}
`
const ScName = styled.p`
  font-weight: bold;
`

const renderer = new marked.Renderer()
renderer.link = markedLink

const Schedule = ({ schedules }) => {
  const { isTablet, isDesktop } = useContext(DetectDeviceContext)
  const paddingBottom = isDesktop ? '70px' : isTablet ? '69px' : '36px'

  return (
    <ScWrapper>
      {schedules.map((schedule, index) => {
        const { name, description, timeSlot, speaker } = schedule

        return (
          <ScItem key={`schedule-${name}-${index}`}>
            <ScImageFlex>
              <ScBoxShadow>
                <ResponsiveImage
                  activeLoad={true}
                  src={speaker?.image?.url || ICON_AUTHOR_PLACEHOLDER}
                  squareSize={'76px'}
                  isCircle={true}
                />
              </ScBoxShadow>
              {index < schedules.length - 1 && <ScVerticalLine />}
            </ScImageFlex>
            <ScDescriptionFlex>
              <ScTimeSlot>{timeSlot}</ScTimeSlot>
              <ScName>{name}</ScName>
              <ScDescription paddingBottom={index + 1 === schedules.length ? '0px' : paddingBottom}>
                <div dangerouslySetInnerHTML={{ __html: marked(description, { renderer }) }} />
              </ScDescription>
            </ScDescriptionFlex>
          </ScItem>
        )
      })}
    </ScWrapper>
  )
}

Schedule.propTypes = {
  schedules: PropTypes.array.isRequired,
}

export default Schedule
