import { useRef, useState, useEffect, useCallback } from 'react'
import { getActivePost } from 'wildsky-components'
import { getPostSponsor } from 'wsc/utils/common'

const hasSponsor = () => {
  const activePost = getActivePost()
  return activePost && getPostSponsor(activePost)
}

export const useRefreshInterval = (disabled, duration) => {
  const [refreshTick, setRefreshTick] = useState(0)
  const intervalRef = useRef(null)
  const enabledRef = useRef(true)
  const durationRef = useRef(duration)

  const setEnabled = enabled => (enabledRef.current = enabled)

  const resetInterval = useCallback(
    duration => {
      let isSponsoredPost = hasSponsor()
      durationRef.current = duration
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        if (enabledRef.current && !isSponsoredPost) setRefreshTick(refreshTick + 1)
        isSponsoredPost = hasSponsor()
      }, durationRef.current)
    },
    [refreshTick]
  )

  useEffect(() => {
    if (disabled) return
    resetInterval(durationRef.current)
    return () => {
      clearInterval(intervalRef.current)
    }
  })

  return [setEnabled, resetInterval]
}
