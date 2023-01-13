import isString from 'lodash/isString'

/**
 * Determine the post type
 * @param {'article' | 'gallery' } postType the post types to be assessed
 * @throws Unknown post types | The parameter is not a string
 * @returns {{ isArticle: boolean, isGallery: boolean }}
 */
export const detectPostType = postType => {
  if (!isString(postType)) {
    throw new Error('The parameter is not a string')
  }

  let isArticle = false
  let isGallery = false

  switch (postType) {
    case 'article':
    case 'video article':
      isArticle = true
      break
    case 'gallery':
    case 'video gallery':
      isGallery = true
      break
    default:
      throw new Error('Unknown post type')
  }

  return { isArticle, isGallery }
}
