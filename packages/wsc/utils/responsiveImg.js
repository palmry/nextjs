import get from 'lodash/get'

export const IMG_FORMAT = 'jpg'
const IMG_PATTERN = 'progressive'
export const IMG_QUALITY = 50
export const IMG_SRCSET_WIDTH_CONFIGS = [150, 300, 600, 900, 1200]

const createSrcBySize = (defaultSrc, size, forSquareImage, squareCroppingPreference) => {
  let url = [defaultSrc]

  if (forSquareImage) {
    url.push(`&h=${size}`)
    if (['left', 'center', 'right'].includes(squareCroppingPreference)) {
      url.push(`&w=${size}&fit=fill`)
      if (['left', 'right'].includes(squareCroppingPreference)) {
        url.push(`&f=${squareCroppingPreference}`)
      }
    }
  } else {
    url.push(`&w=${size}`)
  }

  return url.join('')
}

/**
 * Generate 'src' and 'srcSet' attributes for <img> tag
 * @param {string} src url of an original image
 * @returns {{ srcSet: string, src: string } | {}}
 */
export function createSrcSet(
  src,
  forSquareImage = false,
  squareCroppingPreference = 'center',
  sizeValues = IMG_SRCSET_WIDTH_CONFIGS,
  sizeRules = null,
  imgQuality = IMG_QUALITY,
  imgFormat = IMG_FORMAT
) {
  if (!src) return {}

  const maxWidth = Math.max.apply(null, sizeValues)

  // delete trailing slash, if any
  let srcNoTrailSlash = src
  if (src[src.length - 1] === '/') {
    srcNoTrailSlash = src.slice(0, src.length - 1)
  }

  // check querystring included
  const prefix = srcNoTrailSlash.includes('?') ? '&' : '?'
  const isGif = /\.gif$/i.exec(srcNoTrailSlash)
  const defaultSrc =
    srcNoTrailSlash +
    prefix +
    (isGif
      ? ''
      : `fm=${imgFormat}${imgFormat === 'jpg' ? `&fl=${IMG_PATTERN}` : ''}&q=${imgQuality}`)

  // make srcset and placeholderSrcSet
  const srcSet = []
  const placeholderSrcSet = []

  sizeValues.forEach((size, index) => {
    let rule = get(sizeRules, index, `${size}w`)
    srcSet.push(
      `${createSrcBySize(defaultSrc, size, forSquareImage, squareCroppingPreference)} ${rule}`
    )
    placeholderSrcSet.push(
      `${createSrcBySize(defaultSrc, size / 10, forSquareImage, squareCroppingPreference)} ${rule}`
    )
  })

  return {
    srcSet: srcSet.join(),
    src: createSrcBySize(defaultSrc, maxWidth, forSquareImage, squareCroppingPreference),
    placeholderSrc: createSrcBySize(
      defaultSrc,
      maxWidth / 10,
      forSquareImage,
      squareCroppingPreference
    ),
    placeholderSrcSet: placeholderSrcSet.join(),
  }
}
