import { useState, useEffect } from 'react'
import routes from '../configs/routes'

const ENTER_KEY = 13

export const useSearchStateHandler = (searchInputRef, browserHistory) => {
  const [isShowSearchBar, setIsShowSearchBar] = useState(false)
  const [isActiveSearchButton, setIsActiveSearchButton] = useState(true)

  useEffect(() => {
    const body = document.body
    if (isShowSearchBar) {
      // freeze body when overlay is activated
      body.style.overflow = 'hidden'
    } else {
      // reset text on state changed
      searchInputRef.current.value = ''
      // un-freeze body when search bar is not displayed
      body.style.overflow = 'auto'
    }
  }, [isShowSearchBar, searchInputRef])

  // search input: onpress event
  const onPressSearchInput = event => {
    // if event key is not an ENTER key,
    // then define the state of search button
    if (event.which !== ENTER_KEY) {
      const text = searchInputRef.current.value.trim()
      // if no text exists, then disable search button
      setIsActiveSearchButton(isShowSearchBar && text.length !== 0)
    } else {
      // if event key is an ENTER key and search button is also activated,
      // then execute search action
      if (isActiveSearchButton) onClickSearchButton()
    }
  }
  // search button: onclick event
  const onClickSearchButton = () => {
    if (!isShowSearchBar) {
      // if search bar is not active, then make it active
      setIsShowSearchBar(true)
      setIsActiveSearchButton(false)
    } else {
      // if search bar is already activated and there is any text on input
      // then navigate to search page with input string
      browserHistory.push(routes.search.pathResolver(searchInputRef.current.value.trim()))
    }
  }
  // onclick event for cancel search state
  const onCancelSearch = () => {
    setIsShowSearchBar(false)
    setIsActiveSearchButton(true)
  }
  // search input: ontransitionend event
  const onTransitionEndSearchInput = event => {
    if (isShowSearchBar && event.propertyName === 'visibility') {
      // focus on search bar when search bar is just activated
      searchInputRef.current.focus()
    }
  }

  return {
    isActiveSearchButton,
    isShowSearchBar,
    onClickSearchButton,
    onPressSearchInput,
    onTransitionEndSearchInput,
    onCancelSearch,
  }
}
