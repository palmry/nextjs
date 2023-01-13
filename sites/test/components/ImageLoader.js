import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import LazyLoad from "react-lazyload"

const ScImage = styled.img`
  /* ref: https://stackoverflow.com/questions/5804256/image-inside-div-has-extra-space-below-the-image */
  vertical-align: top;
  width: 100%;
  object-fit: cover;

  ${(props) =>
    props.filter &&
    `
    filter: ${props.filter};
  `}

  ${(props) =>
    props.transition &&
    `
    transition: ${props.transition};
  `}

  /* width option */
  ${(props) =>
    props.fixedWidth &&
    `
    width: ${props.fixedWidth};
  `}

  /* height option */
  ${(props) =>
    props.fixedHeight &&
    `
    height: ${props.fixedHeight};
  `}

  /* max-width option */
  ${(props) =>
    props.maxWidth &&
    `
    max-width: ${props.maxWidth};
  `}

  /* max-height option */
  ${(props) =>
    props.maxHeight &&
    `
    max-height: ${props.maxHeight};
  `}

  /* square option */
  ${(props) =>
    props.squareSize &&
    `
    height: ${props.squareSize};
    width: ${props.squareSize};
    object-position: ${props.squareCroppingPreference};
  `}

  /* circle option */
  ${(props) =>
    props.isCircle &&
    `
    border-radius: 50%;
  `}

  /* square responsive option */
  ${(props) =>
    props.isSqrFlex &&
    `
    position: absolute;
    left: 0;
  `}
`

const ImageLoader = ({
  placeholderSrc,
  placeholderSrcSet,
  src,
  srcSet,
  activeLoad,
  ...restProps
}) => {
  const realImgProp = {
    src: src,
    srcSet: srcSet,
    filter: "blur(0px)",
    transition: "filter .2s",
    ...restProps,
  }
  const placeHolderImgProp = {
    src: placeholderSrc,
    srcSet: placeholderSrcSet,
    filter: "blur(10px)",
    ...restProps,
  }
  return activeLoad ? (
    <ScImage {...realImgProp} />
  ) : (
    getImageWithLazyLoad(placeHolderImgProp, realImgProp)
  )
}
function getImageWithLazyLoad(placeHolderImgProp, realImgProp) {
  return (
    <LazyLoad placeholder={<ScImage {...placeHolderImgProp} />} once>
      <ScImage {...realImgProp} />
    </LazyLoad>
  )
}
export default ImageLoader

ImageLoader.propTypes = {
  alt: PropTypes.string,
  title: PropTypes.string,
  src: PropTypes.string.isRequired,
  placeholderSrc: PropTypes.string.isRequired,
  placeholderSrcSet: PropTypes.string,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
  maxHeight: PropTypes.string,
  fixedHeight: PropTypes.string,
  fixedWidth: PropTypes.string,
  squareSize: PropTypes.string,
  squareCroppingPreference: PropTypes.oneOf([
    "none",
    "left",
    "center",
    "right",
  ]),
  isCircle: PropTypes.bool,
  isSqrFlex: PropTypes.bool,
  activeLoad: PropTypes.bool,
}

ImageLoader.defaultProps = {
  alt: null,
  title: null,
  srcSet: null,
  sizes: null,
  placeholderSrcSet: null,
  maxHeight: null,
  fixedHeight: null,
  fixedWidth: null,
  squareSize: null,
  squareCroppingPreference: "center",
  isCircle: false,
  isSqrFlex: false,
  activeLoad: false,
}
