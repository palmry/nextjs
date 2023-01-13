import React from 'react'
import SuggestedPosts from '../../components/post/SuggestedPosts'
const paragraphIndex = 9

export const getSuggestedPostInjector = (suggestedPosts, categorySlug, slug) => {
  const props = { suggestedPosts, categorySlug, slug }
  let deferSuggestedPost = false

  return (index, paragraph, options) => {
    if (index === paragraphIndex || (index > paragraphIndex && deferSuggestedPost)) {
      // if paragraph is a header, defer suggested post to the next paragraph
      if (/^\s*#/.test(paragraph)) {
        deferSuggestedPost = true
        return
      }
      deferSuggestedPost = false

      return {
        after: <SuggestedPosts {...props} />,
      }
    }
  }
}
