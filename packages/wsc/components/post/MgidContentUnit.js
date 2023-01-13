import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const MgidContentUnit = ({ postCount, metaData }) => {
  const data =
    postCount === 0
      ? metaData?.first
      : postCount === 1
      ? metaData?.second
      : postCount > 1
      ? metaData?.subsequent
      : null

  useEffect(() => {
    //moving library script here to load only when needed
    const s = document.createElement('script')
    s.async = true
    s.src = data?.src
    document.head.appendChild(s)
  })

  if (!data) {
    return <></>
  }
  return <div id={data?.id}></div>
}
MgidContentUnit.propTypes = {
  postCount: PropTypes.number.isRequired,
  metaData: PropTypes.object.isRequired,
}

MgidContentUnit.defaultProps = {}
export default MgidContentUnit
