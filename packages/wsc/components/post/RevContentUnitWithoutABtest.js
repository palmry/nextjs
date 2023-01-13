import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { Helmet } from 'react-helmet'

const RevContentUnitWithoutABtest = ({ postCount, metaData }) => {
  const unitRef = useRef(null)

  useEffect(() => {
    if (unitRef.current && unitRef.current.childElementCount === 0 && window.renderRCWidget) {
      window.renderRCWidget(unitRef.current)
    }
  })
  let data

  if (postCount === 0) data = metaData?.first
  else if (postCount === 1) data = metaData?.second
  else if (postCount > 1) data = metaData?.subsequent

  if (!data) {
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
RevContentUnitWithoutABtest.propTypes = {
  postCount: PropTypes.number.isRequired,
  metaData: PropTypes.object.isRequired,
}

RevContentUnitWithoutABtest.defaultProps = {}
export default RevContentUnitWithoutABtest
