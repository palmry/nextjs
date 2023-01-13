import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { useExperiment } from '../AbTest'
import { Helmet } from 'react-helmet'

const RevContentUnit = ({ postCount, isSponsored }) => {
  const FirstArticlesExperiment = useExperiment('rev-content-first-articles')
  const SubsequentArticlesExperiment = useExperiment('rev-content-subsequent-articles')
  const SponsoredPostExperiment = useExperiment('rev-content-sponsored')
  const unitRef = useRef(null)

  useEffect(() => {
    if (unitRef.current && unitRef.current.childElementCount === 0 && window.renderRCWidget) {
      window.renderRCWidget(unitRef.current)
    }
  })
  let data

  if (FirstArticlesExperiment.showRevC) {
    if (postCount === 0) data = FirstArticlesExperiment.metaData?.first
    else if (postCount === 1) data = FirstArticlesExperiment.metaData?.second
    else if (SubsequentArticlesExperiment.showRevC && postCount > 1)
      data = SubsequentArticlesExperiment.metaData?.subsequent
  }

  if (!data || (SponsoredPostExperiment.disableSponsoredPosts && isSponsored)) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <script
          type="text/javascript"
          src="https://assets.revcontent.com/master/delivery.js"
          defer="defer"
        />
      </Helmet>

      <div
        ref={unitRef}
        data-rc-widget
        data-widget-host="habitat"
        data-endpoint="//trends.revcontent.com"
        data-widget-id={data.widgetId}
      ></div>
    </>
  )
}
RevContentUnit.propTypes = {
  postCount: PropTypes.number.isRequired,
  isSponsored: PropTypes.bool.isRequired,
}

RevContentUnit.defaultProps = {}
export default RevContentUnit
