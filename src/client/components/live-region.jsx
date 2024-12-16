import React, { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash.debounce'
import { useApp } from '../store/app/useApp'
import { useSdk } from '../store/sdk/useSdk'

const DEBOUNCE_MILLISECONDS = 2000

export const LiveRegion = () => {
  const { liveRegionText, setLiveRegionText } = useApp()
  const { agentStatus } = useSdk()

  const [textA, setTextA] = useState()
  const [textB, setTextB] = useState()

  const isSessionEnded = agentStatus === 'closed' || agentStatus === null

  const clearText = () => {
    setTextA()
    setTextB()
  }

  const setText = useCallback(debounce(text => {
    if (textA) {
      setTextB(text)
    } else {
      setTextA(text)
    }
  }, DEBOUNCE_MILLISECONDS), [textA, textB])

  useEffect(() => {
    if (liveRegionText) {
      clearText()
      setText(liveRegionText)
    }

    if (isSessionEnded) {
      clearText()
      setLiveRegionText()
    }

    return () => {
      clearText()
      setLiveRegionText()
    }
  }, [liveRegionText])

  return (
    <>
      <div className='wc-live' role='status' aria-atomic='true'>
        {textA}
      </div>
      <div className='wc-live' role='status' aria-atomic='true'>
        {textB}
      </div>
    </>
  )
}
