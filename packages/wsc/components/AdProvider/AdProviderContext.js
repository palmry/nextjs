import React from 'react'

const AdProviderContext = React.createContext({
  refreshSlot: () => {},
  refreshAll: () => {},
  config: {},
  setConfig: () => {},
  globalConfig: {},
  slotIdMap: {},
  debug: false,
})

export default AdProviderContext
