import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ContentMarkdown from 'wsc/components/post/ContentMarkdown'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'

import FancyHeader from './FancyHeader'
import ResponsiveImage from './ResponsiveImage'
import SponsoredElement from './SponsoredElement'
import { MEDIA, withResponsiveHidden, withFullWidth } from '../utils/styles'
import { COLORS } from '../utils/styles'
const ScWrapper = styled.div`
  position: relative;
`
const ScHeaderBox = styled.div`
  ${props => props.fixedHeight && `min-height: ${props.fixedHeight};`}
`
const ScInfoBox = styled.div`
  width: 100%;
  display: inline-block;
  vertical-align: top;
  padding: 1.25rem 1rem 0 0;
  ${MEDIA.MOBILE`padding-top: 1rem`}

  ${props => props.fixedWidth && `width: ${props.fixedWidth};`}
`
const ScTitleBox = styled.div`
  display: inline-block;
  ${props => props.haveMaxWidth && MEDIA.DESKTOP`max-width: 788px;`}
  ${props => props.haveMaxWidth && MEDIA.TABLET`max-width: 374px;`}
  ${props => props.haveMaxWidth && MEDIA.MOBILE`max-width: 268px;`}
`
const ScImageBox = styled.div`
  && { position: absolute; }
  display: inline-block;
  vertical-align: top;
  right: 0;
  z-index: -1;

  ${props => props.fixedWidth && `width: ${props.fixedWidth};`}
  ${MEDIA.DESKTOP`position: unset;`}
  ${MEDIA.MOBILE`
    top: 0;
    padding: 0 12px;
    ${withFullWidth}
`}
`
const ScDescription = styled.div.attrs({
  className: 'font-body',
})`
  margin-top: 1.88rem;
  ${MEDIA.DESKTOP`margin-top: 0.65rem;`}
  ${props =>
    withResponsiveHidden({
      existOnDesktop: props.existOnDesktop,
      hideOnDesktop: props.hideOnDesktop,
    })}

  ${props => props.fixedWidth && `width: ${props.fixedWidth};`}

  p:not(:last-child) {
    margin-bottom: 15px;
  }

  p:last-child {
    margin-bottom: 0px;
  }
`
const SponsoredElementWithMargin = styled(SponsoredElement)`
  margin: 30px auto;
  ${MEDIA.DESKTOP`margin: 40px auto 0px;`}
`

const ScImageCredit = styled.div.attrs({
  className: 'font-description',
})`
  color: ${COLORS.GREY};
  text-align: right;
  letter-spacing: 0.048rem;
  ${MEDIA.TABLET`
    letter-spacing:0.046rem;
  `}
  ${MEDIA.DESKTOP`
    letter-spacing:0.043rem;
  `}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const ModelHeader = ({ title, description, image, sponsor, credit, underline }) => {
  const { isTablet, isDesktop } = useContext(DetectDeviceContext)
  const { url: imageUrl, title: imageTitle, description: imageDesc } = image || {}
  // handle width/height for each device
  const headerHeight = isDesktop ? '272px' : '200px'
  const imageWidth = isDesktop ? '536px' : isTablet ? '380px' : 'calc(100%-24px)'
  // Container height will be fixed, if it has image inside.
  // Because image will be absoluted with container that caused to container height.
  return (
    <ScWrapper>
      <ScHeaderBox fixedHeight={imageUrl && headerHeight}>
        <ScInfoBox>
          <ScTitleBox haveMaxWidth={imageUrl ? true : false}>
            <FancyHeader
              title={title}
              withCenterLayout={false}
              underlineImage={null}
              isUnderlineImageCenterAlign={false}
              titleHtmlTag="h1"
              titleClassName={''}
              withUnderline={underline}
            />
          </ScTitleBox>
          {description && (
            <ScDescription fixedWidth={imageUrl && `calc(100% - ${imageWidth})`} existOnDesktop>
              <ContentMarkdown content={description} />
            </ScDescription>
          )}
        </ScInfoBox>

        {imageUrl && (
          <ScImageBox fixedWidth={imageWidth}>
            <ResponsiveImage
              title={imageTitle}
              alt={imageDesc}
              fixedHeight={headerHeight}
              src={imageUrl}
              sizes={imageWidth}
            />
            <ScImageCredit>{credit}</ScImageCredit>
          </ScImageBox>
        )}
      </ScHeaderBox>
      <SponsoredElementWithMargin sponsor={sponsor} hideOnDesktop />
      {description && (
        <ScDescription hideOnDesktop>
          <ContentMarkdown content={description} />
        </ScDescription>
      )}
      <SponsoredElementWithMargin sponsor={sponsor} existOnDesktop />
    </ScWrapper>
  )
}

ModelHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  sponsor: PropTypes.object,
  image: PropTypes.shape({
    url: PropTypes.string,
  }),
  credit: PropTypes.string,
  underline: PropTypes.bool,
}

ModelHeader.defaultProps = {
  title: null,
  description: null,
  sponsor: null,
  image: {},
  credit: null,
  underline: false,
}

export default ModelHeader
