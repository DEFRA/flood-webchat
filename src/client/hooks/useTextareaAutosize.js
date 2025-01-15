import { useEffect } from 'react'

export const useTextareaAutosize = (textAreaRef, value, isChatOpen) => {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = '0px'

      const scrollHeight = textAreaRef.scrollHeight

      textAreaRef.style.height = `${scrollHeight}px`
    }
  }, [textAreaRef, value, isChatOpen])
}
