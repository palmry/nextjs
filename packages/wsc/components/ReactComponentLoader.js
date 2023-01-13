import React, { Suspense } from 'react'
import LazyLoad from 'react-lazyload'
import PropTypes from 'prop-types'

const ReactComponentLoader = ({
  viewportLazyLoad,
  viewportOffset,
  viewportLazyLoadOnce,
  fallback,
  children,
}) => {
  let baseComponent = <Suspense fallback={fallback}>{children}</Suspense>
  if (viewportLazyLoad)
    baseComponent = (
      <LazyLoad once={viewportLazyLoadOnce} offset={viewportOffset}>
        {baseComponent}
      </LazyLoad>
    )
  return baseComponent
}

ReactComponentLoader.propTypes = {
  viewportLazyLoad: PropTypes.bool,
  viewportOffset: PropTypes.number,
  viewportLazyLoadOnce: PropTypes.bool,
  fallback: PropTypes.element,
  children: PropTypes.element.isRequired,
}

ReactComponentLoader.defaultProps = {
  viewportLazyLoad: true,
  viewportOffset: 600,
  viewportLazyLoadOnce: true,
  fallback: <div></div>,
}

export default ReactComponentLoader
