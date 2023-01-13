import React, { useState } from 'react'
import PropTypes from 'prop-types'

const PreviewSiteBannerStateContext = React.createContext(null)

const PreviewSiteBannerProvider = props => {
  const [isShowPreviewSiteBar, setIsShowPreviewSiteBar] = useState(
    process.env.REACT_APP_ENVIRONMENT === 'preview' ? true : false
  )
  return (
    <PreviewSiteBannerStateContext.Provider
      value={{ isShowPreviewSiteBar, setIsShowPreviewSiteBar }}
    >
      {props.children}
    </PreviewSiteBannerStateContext.Provider>
  )
}

PreviewSiteBannerStateContext.propTypes = {
  children: PropTypes.node.isRequired,
}

export { PreviewSiteBannerProvider, PreviewSiteBannerStateContext }
