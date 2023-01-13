import React, { useRef, useState } from 'react'
import get from 'lodash/get'
import { getConfig } from '../../globalConfig'
import { getActivePost } from '../../utils/activePost'

const PostNavContext = React.createContext()
const routes = getConfig('Routes')

const getPostItems = currentPost => {
  const items = get(
    currentPost,
    'multipleSeriesCollection.items[0].contentNavigation.itemsCollection.items'
  )
  if (!currentPost || !items) return null
  items.forEach(item => {
    item.path = routes.post.pathResolver(item.post.mainCategory.slug, item.post.slug)
  })
  return items
}

const getCurrentIndex = (currentPost, items) => {
  if (!currentPost || !items) return null
  const currentIndex = items.findIndex(item => currentPost.sys.id === item.post.sys.id)
  return currentIndex !== -1 ? currentIndex : null
}

const getPreviousPost = (currentIndex, items) => {
  if (currentIndex === null || !items) return null
  return currentIndex > 0 ? items[currentIndex - 1] : items[items.length - 1]
}

const getNextPost = (currentIndex, items) => {
  if (currentIndex === null || !items) return null
  return currentIndex < items.length - 1 ? items[currentIndex + 1] : items[0]
}

const PostNavProvider = props => {
  const [isShowPostNavBar, setIsShowPostNavBar] = useState(false)
  const postBarVisibilityMap = useRef({})
  const [postNavBarOffset, setPostNavBarOffset] = useState(2)
  const [currentPost, setCurrentPost] = useState(null)
  const postItems = getPostItems(currentPost)
  const currentIndex = getCurrentIndex(currentPost, postItems)
  const previousPost = getPreviousPost(currentIndex, postItems)
  const nextPost = getNextPost(currentIndex, postItems)
  const isDisabled = !postItems || !previousPost || !nextPost || postItems.length < 2

  return (
    <PostNavContext.Provider
      value={{
        isShowPostNavBar,
        postBarVisibilityMap,
        isPostBarVisible: postId => !!postBarVisibilityMap.current[postId],
        setIsShowPostNavBar,
        setPostBarVisible: (isVisible, postId) => {
          const isActivePost = getActivePost().sys.id === postId
          postBarVisibilityMap.current[postId] = isVisible
          if (isActivePost) setIsShowPostNavBar(!isVisible)
        },
        postNavBarOffset,
        setPostNavBarOffset,
        currentPost,
        currentIndex,
        setCurrentPost,
        previousPost,
        nextPost,
        isDisabled,
      }}
    >
      {props.children}
    </PostNavContext.Provider>
  )
}

export {
  PostNavContext,
  PostNavProvider,
  getCurrentIndex,
  getNextPost,
  getPostItems,
  getPreviousPost,
}
