import React, { useState } from 'react'
import PropTypes from 'prop-types'

import APP_CONFIGS from '../../configs/app'
const LocaleStateContext = React.createContext(null)

const LocaleProvider = (props) => {
  let defaultState =
    typeof window !== 'undefined'
      ? localStorage.getItem('locale')
      : APP_CONFIGS.language

  // Validate setting for local machine because we sometime test ML which contain 2 languages
  if (!APP_CONFIGS.languageList.includes(defaultState))
    defaultState = APP_CONFIGS.language

  const [locale, setLocale] = useState(defaultState)

  return (
    <LocaleStateContext.Provider value={{ locale, setLocale }}>
      {props.children}
    </LocaleStateContext.Provider>
  )
}

LocaleProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { LocaleProvider, LocaleStateContext }
