import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../../utils/styles'
import PropTypes from 'prop-types'
import routes from '../../configs/routes'
import Link from 'wsc/components/Link'
import { MEDIA, FONT_FAMILIES } from '../../utils/styles'
import SeriesPostList from '../SeriesPostList'
import WhiteBottonBox from '../WhiteBottonBox'

const ScWrapper = styled.div`
  margin: 0;
`
const ScTextWrapper = styled.div`
  margin: 0;
  text-align: center;
`
const MoreFromThisSeries = styled.p`
  font-size: 0.94rem;
  ${MEDIA.MOBILE`font-size: 1rem;`}
`
const ScSeriesLink = styled(Link)`
  font-family: ${FONT_FAMILIES.ASAP};
  border-color: ${COLORS.LT_DARK_ORANGE};
  font-size: 1.25rem;
  &:hover {
    color: unset;
  }
  ${MEDIA.MOBILE`font-size: 1.13rem;`}
`
const ButtonWarper = styled.div`
  ${MEDIA.MOBILE`margin-top: 20px `}
  ${MEDIA.TABLET`margin-top: 26px`}
  ${MEDIA.DESKTOP`margin-top: 26px`}
`
const SeriesBackgroundBlocking = styled.div`
background-image: linear-gradient(124deg, ${COLORS.LT_LIGHT_PEACH}, ${COLORS.LT_SUN_YELLOW});
  background-position: 0 20px;
  background-repeat: no-repeat;
  ${MEDIA.MOBILE`
  background-image: linear-gradient(133deg, ${COLORS.LT_LIGHT_PEACH}, ${COLORS.LT_SUN_YELLOW});
    padding: 0 23px;
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    padding-bottom: 24px;
    margin-top: 24px;`}
  ${MEDIA.TABLET`
    padding: 0 20px;
    padding-bottom: 42px;
    margin-top: 30px;
  `}
  ${MEDIA.DESKTOP`
    padding: 0 20px;
    padding-bottom: 30px;
    margin-top: 30px;
  `}
`

const SeriesBackLink = props => {
  const { sysId, seriesSlugTitle, seriesSlugURL, currentPost } = props

  if (!seriesSlugURL) {
    return null
  }

  return (
    <ScWrapper>
      <ScTextWrapper>
        <MoreFromThisSeries>{'More from this series:'}</MoreFromThisSeries>
        <ScSeriesLink to={routes.series.pathResolver(seriesSlugURL)}>
          <b>{seriesSlugTitle.toUpperCase()}</b>
        </ScSeriesLink>
      </ScTextWrapper>
      <SeriesBackgroundBlocking>
        <SeriesPostList
          queryString={`&fields.multipleSeries.sys.id=${sysId}&sys.id[ne]=${currentPost}`}
        />
        <ScTextWrapper>
          <ButtonWarper>
            <WhiteBottonBox to={routes.series.pathResolver(seriesSlugURL)} text="SEE THIS SERIES" />
          </ButtonWarper>
        </ScTextWrapper>
      </SeriesBackgroundBlocking>
    </ScWrapper>
  )
}

SeriesBackLink.propTypes = {
  sysId: PropTypes.string,
  seriesSlugTitle: PropTypes.string,
  seriesSlugURL: PropTypes.string,
  currentPost: PropTypes.string,
}

SeriesBackLink.defaultProps = {
  sysId: null,
  seriesSlugTitle: null,
  seriesSlugURL: null,
  currentPost: null,
}

export default SeriesBackLink
