import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { useContext } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { MEDIA, FONT_FAMILIES, COLORS } from '../../utils/styles'
import Link from 'wsc/components/Link'
import routes from '../../configs/routes'
import right from '../../statics/images/icon-nav-left.svg'
import AuthorImage from '../AuthorImage'
import { useTranslator } from '../../hooks/useTranslator'

const ScWrapper = styled.div`
  text-align: center;
`
const ScTitle = styled.div`
  color: ${COLORS.BLACK};
  font-family: ${FONT_FAMILIES.POPPINS};
  font-size: 1.25rem;
  line-height: 2.125rem;
  text-transform: uppercase;
  ${MEDIA.MOBILE`
    font-size: 1.13rem;
    line-height: 1.7rem;
  `}
  ${MEDIA.TABLET`
    font-size: 1.19rem;
    line-height: 2rem;
  `}
`
const ScContributorImageList = styled.div`
  margin-top: 36px;
  ${MEDIA.MOBILE`margin-top: 21px;`}
  display:flex;
  justify-content: center;
`
const ScContributorImage = styled.div`
  margin: 0 -7px;
  ${MEDIA.DESKTOP`margin: 0 -10px;`}
  ${(props) => props.zindex && `z-index: ${props.zindex};`}
`
const ScLinkSetBox = styled.div`
  margin-top: 30px;
  ${MEDIA.MOBILE`
    margin-top: 14px;
  `}
`

const ScLink = styled((props) => <Link {...props} />).attrs({
  className: 'font-description',
})`
  letter-spacing: 0.76px;
  line-height: 1.2rem;
  text-transform: uppercase;

  ${MEDIA.DESKTOP`
    font-size: 0.69rem;
    letter-spacing: 0.68px;
    line-height: 1.19rem;
  `}

  ${MEDIA.TABLET`
    font-size: 0.75rem;
    letter-spacing: 0.73px;
    line-height: 1.34rem;
  `}

  &:hover {
    border-bottom: 0.125rem solid ${COLORS.LT_SUN_YELLOW};
  }
`

const IconNext = styled(right)`
  fill: ${COLORS.BLACK}
  width: 4.5px;
  height: 8.4px;
  margin-left: 6px;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const AboutContributor = ({ contributors }) => {
  const { isDesktop } = useContext(DetectDeviceContext)
  const { translator } = useTranslator()
  return (
    <ScWrapper>
      <ScTitle>{translator('aboutPage.meetOurTeam')}</ScTitle>
      <ScContributorImageList>
        {contributors.map((contributor, index) => {
          const contributorImage = get(contributor, 'image.url')

          return (
            !isEmpty(contributors) && (
              <ScContributorImage
                key={`author-${contributor.slug}`}
                zindex={contributors.length - index}
              >
                <Link withDefaultStyle={false} to={routes.authorIndex.path}>
                  <AuthorImage
                    withShadow={false}
                    title={contributor.name}
                    src={contributorImage}
                    size={isDesktop ? '117px' : '79px'}
                    resourceSizeValues={[117, 234, 468]}
                    resourceSizeRules={['1x', '2x', '3x']}
                    isCircle={true}
                  />
                </Link>
              </ScContributorImage>
            )
          )
        })}
      </ScContributorImageList>
      {/* SEE all contributors */}
      <ScLinkSetBox>
        <ScLink withDefaultStyle={false} to={routes.authorIndex.path}>
          {translator('aboutPage.seeAllContributors')}
        </ScLink>
        <IconNext />
      </ScLinkSetBox>
    </ScWrapper>
  )
}

AboutContributor.propTypes = {
  contributors: PropTypes.array.isRequired,
}

AboutContributor.defaultProps = {}

export default AboutContributor
