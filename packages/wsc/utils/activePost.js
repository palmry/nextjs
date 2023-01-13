/**
 * State for tracking which post is 'active' in the viewport.
 * Need this so we can update URL only for the active post.
 * We're not using props or context here to avoid rerenders,
 * which aren't necesarry when this changes and we want to avoid prop-drilling a ref.
 */

const state = {
  activePost: null,
  lastActivePost: null,
}

export const setActivePost = post => {
  if (state.activePost) {
    // There is a chance to collect the wrong last post by ads that
    // pushes the whole content while reaching to a new article.
    if (!isActivePost(post)) state.lastActivePost = state.activePost
  }
  state.activePost = post
}

export const isActivePost = post => state.activePost && post.sys.id === state.activePost.sys.id

export const getLastActivePost = () => state.lastActivePost

export const getActivePost = () => state.activePost

export const clearLastActivePost = () => (state.lastActivePost = null)

export const isLastActivePost = post =>
  state.lastActivePost && post.sys.id === state.lastActivePost.sys.id

export const clearAllActivePosts = () => {
  state.activePost = null
  state.lastActivePost = null
}
